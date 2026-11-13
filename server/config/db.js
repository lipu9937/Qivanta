const mongoose = require("mongoose");

// Keeps the API alive even when MongoDB is down, and keeps retrying.
// (Before, the whole server exited, so the website could not load any data.)
let retryTimer;

// Creates/updates the admin account from ADMIN_EMAIL + ADMIN_PASSWORD on every start,
// so no separate seed step is needed for login to work.
async function ensureAdmin() {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;
  try {
    const { User } = require("../models");
    const user = await User.findOne({ email });
    if (!user) {
      await User.create({ name: "Admin", email, password });
      console.log(`Admin created: ${email}`);
    } else if (!(await user.matchPassword(password))) {
      user.password = password; // re-hashed by the model
      await user.save();
      console.log(`Admin password updated: ${email}`);
    }
  } catch (e) {
    console.error("ensureAdmin failed:", e.message);
  }
}

async function connect() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI is missing. Create server/.env (copy server/.env.example).");
    return;
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("MongoDB connected");
    await ensureAdmin();
  } catch (e) {
    console.error(`MongoDB connection failed: ${e.message}`);
    console.error("-> Start MongoDB locally, or put a MongoDB Atlas string in MONGO_URI (server/.env). Retrying in 5s...");
    clearTimeout(retryTimer);
    retryTimer = setTimeout(connect, 5000);
  }
}

mongoose.connection.on("disconnected", () => console.warn("MongoDB disconnected"));

module.exports = connect;