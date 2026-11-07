const express = require("express");
const auth = require("../middleware/auth");
const ah = require("./asyncHandler");

// Public GET (list + optional slug), admin-only POST/PUT/DELETE
module.exports = (Model, { filter = {}, sort = { createdAt: -1 }, bySlug = false } = {}) => {
  const router = express.Router();
  const notFound = (res) => res.status(404).json({ message: "Not found" });

  router.get("/", ah(async (req, res) => res.json(await Model.find(filter).sort(sort))));

  if (bySlug) {
    router.get("/:slug", ah(async (req, res) => {
      const doc = await Model.findOne({ slug: req.params.slug, ...filter });
      doc ? res.json(doc) : notFound(res);
    }));
  }

  router.post("/", auth, ah(async (req, res) => res.status(201).json(await Model.create(req.body))));

  router.put("/:id", auth, ah(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    doc ? res.json(doc) : notFound(res);
  }));

  router.delete("/:id", auth, ah(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    doc ? res.json({ message: "Deleted" }) : notFound(res);
  }));

  return router;
};
