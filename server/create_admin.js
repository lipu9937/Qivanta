require("dotenv").config();

const mongoose = require("mongoose");
const M = require("./models");

async function createAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD is missing.");
    }

    if (password.length < 12) {
      throw new Error("Use an admin password with at least 12 characters.");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected.");

    if (!M.User) {
      throw new Error("User model not found. Check server/models/index.js");
    }

    const existingAdmin = await M.User.findOne({ email });

    if (existingAdmin) {
      console.log("A user with this admin email already exists.");
      console.log("No existing account was changed.");
      return;
    }

    await M.User.create({
      name: "Admin",
      email,
      password
    });

    console.log("Admin account created successfully.");
    console.log("Admin email:", email);

  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();