const router = require("express").Router();
const { Post } = require("../models");
const auth = require("../middleware/auth");
const ah = require("../utils/asyncHandler");

const escapeRx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Public: published posts with pagination, search and category filter
router.get("/", ah(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(24, parseInt(req.query.limit) || 6);
  const filter = { published: true };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.q) {
    const rx = new RegExp(escapeRx(req.query.q), "i");
    filter.$or = [{ title: rx }, { excerpt: rx }];
  }
  const [items, total] = await Promise.all([
    Post.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).select("-content"),
    Post.countDocuments(filter),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
}));

// Admin: all posts including drafts (must be before /:slug)
router.get("/admin/all", auth, ah(async (req, res) => res.json(await Post.find().sort({ createdAt: -1 }))));

// NEW: related articles (same category first, then newest), excluding the current one
router.get("/:slug/related", ah(async (req, res) => {
  const current = await Post.findOne({ slug: req.params.slug, published: true }).select("category");
  if (!current) return res.json([]);
  const base = { published: true, slug: { $ne: req.params.slug } };
  let items = await Post.find({ ...base, category: current.category }).sort({ createdAt: -1 }).limit(3).select("-content");
  if (items.length < 3) {
    const more = await Post.find({ ...base, _id: { $nin: items.map((i) => i._id) } })
      .sort({ createdAt: -1 }).limit(3 - items.length).select("-content");
    items = items.concat(more);
  }
  res.json(items);
}));

router.get("/:slug", ah(async (req, res) => {
  // Counts one view per request (NEW). timestamps:false keeps "updatedAt" unchanged.
  const post = await Post.findOneAndUpdate(
    { slug: req.params.slug, published: true },
    { $inc: { views: 1 } },
    { new: true, timestamps: false }
  );
  post ? res.json(post) : res.status(404).json({ message: "Post not found" });
}));

router.post("/", auth, ah(async (req, res) => res.status(201).json(await Post.create(req.body))));

router.put("/:id", auth, ah(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  post.set(req.body);
  await post.save();
  res.json(post);
}));

router.delete("/:id", auth, ah(async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
}));

module.exports = router;
