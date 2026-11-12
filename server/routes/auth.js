const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { User } = require("../models");
const auth = require("../middleware/auth");
const ah = require("../utils/asyncHandler");

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

router.post("/login", ah(async (req, res) => {
  const { email, password } = schema.parse(req.body);
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Wrong email or password" });
  }
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}));

router.get("/me", auth, ah(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  user ? res.json(user) : res.status(401).json({ message: "User not found" });
}));

module.exports = router;
