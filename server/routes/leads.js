const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const { z } = require("zod");
const { Lead } = require("../models");
const auth = require("../middleware/auth");
const ah = require("../utils/asyncHandler");
const sendEmail = require("../utils/sendEmail");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many requests. Please try again in a few minutes." },
});

const opt = z.string().trim().optional();
const leadSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().email("Enter a valid email"),
  phone: opt, company: opt, service: opt, budget: opt, timeline: opt,
  message: z.string().trim().min(10, "Please add more detail"),
});
const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

router.post("/", limiter, ah(async (req, res) => {
  const data = leadSchema.parse(req.body);
  Object.keys(data).forEach((k) => data[k] === "" && delete data[k]);
  const lead = await Lead.create(data);

  // Fire-and-forget emails: the lead is already saved
  sendEmail({
    to: process.env.EMAIL_USER,
    subject: `New lead: ${lead.name}`,
    html: `<p><b>${esc(lead.name)}</b> (${esc(lead.email)}) asked about ${esc(lead.service || "a project")} (budget: ${esc(lead.budget || "n/a")}, timeline: ${esc(lead.timeline || "n/a")}).</p><p>${esc(lead.message)}</p>`,
  });
  sendEmail({
    to: lead.email,
    subject: "We received your project request",
    html: `<p>Hi ${esc(lead.name)},</p><p>Thanks for your project request. Our team will reply within 24 hours.</p><p>The QIVANTA team</p>`,
  });

  res.status(201).json({ message: "Thanks! We'll reply within 24 hours." });
}));

router.get("/", auth, ah(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.q) {
    const rx = new RegExp(req.query.q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: rx }, { email: rx }, { company: rx }];
  }
  res.json(await Lead.find(filter).sort({ createdAt: -1 }));
}));

router.patch("/:id", auth, ah(async (req, res) => {
  const { status } = z.object({ status: z.enum(["new", "contacted", "closed"]) }).parse(req.body);
  const lead = await Lead.findByIdAndUpdate(req.params.id, { status }, { new: true });
  lead ? res.json(lead) : res.status(404).json({ message: "Lead not found" });
}));

router.delete("/:id", auth, ah(async (req, res) => {
  await Lead.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
}));

module.exports = router;
