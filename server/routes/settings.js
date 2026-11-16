const router = require("express").Router();
const { z } = require("zod");
const { SiteSetting } = require("../models");
const defaults = require("../data/defaults");
const auth = require("../middleware/auth");
const ah = require("../utils/asyncHandler");

// NEW: public contact details / footer text, editable by the admin.
const pick = (s) => ({
  email: s.email, phone: s.phone, address: s.address, hours: s.hours, footerText: s.footerText,
});

const load = () =>
  SiteSetting.findOneAndUpdate({ key: "main" }, { $setOnInsert: { ...defaults.settings } }, { upsert: true, new: true });

router.get("/", ah(async (req, res) => res.json(pick(await load()))));

router.put("/", auth, ah(async (req, res) => {
  const data = z.object({
    email: z.string().trim().email("Enter a valid email").or(z.literal("")),
    phone: z.string().trim().max(40),
    address: z.string().trim().max(200),
    hours: z.string().trim().max(120),
    footerText: z.string().trim().max(300),
  }).partial().parse(req.body);
  const s = await load();
  Object.assign(s, data);
  await s.save();
  res.json(pick(s));
}));

module.exports = router;
