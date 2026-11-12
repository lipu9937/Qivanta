module.exports = (err, req, res, next) => {
  if (err.name === "ZodError") {
    return res.status(400).json({ message: err.issues[0]?.message || "Invalid input", errors: err.issues });
  }
  if (err.code === 11000) return res.status(409).json({ message: "That value already exists" });
  if (err.name === "CastError") return res.status(400).json({ message: "Invalid id" });
  if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
};
