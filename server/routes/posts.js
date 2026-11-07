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

router.get("/:slug", ah(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug, published: true });
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
