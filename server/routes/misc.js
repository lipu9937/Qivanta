const router = require("express").Router();
const { z } = require("zod");
const { Lead, Post, Subscriber, Project } = require("../models");
const auth = require("../middleware/auth");
const ah = require("../utils/asyncHandler");

router.post("/subscribe", ah(async (req, res) => {
  const { email } = z.object({ email: z.string().trim().email("Enter a valid email") }).parse(req.body);
  await Subscriber.updateOne({ email: email.toLowerCase() }, { $setOnInsert: { email } }, { upsert: true });
  res.status(201).json({ message: "You're subscribed. Welcome aboard!" });
}));

router.get("/stats", auth, ah(async (req, res) => {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [totalLeads, newThisWeek, newLeads, publishedPosts, subscribers, projects] = await Promise.all([
    Lead.countDocuments(),
    Lead.countDocuments({ createdAt: { $gte: weekAgo } }),
    Lead.countDocuments({ status: "new" }),
    Post.countDocuments({ published: true }),
    Subscriber.countDocuments(),
    Project.countDocuments(),
  ]);
  res.json({ totalLeads, newThisWeek, newLeads, publishedPosts, subscribers, projects });
}));

module.exports = router;
