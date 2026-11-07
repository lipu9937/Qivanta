const mongoose = require("mongoose");

// Keeps the API alive even when MongoDB is down, and keeps retrying.
// (Before, the whole server exited, so the website could not load any data.)
let retryTimer;

async function connect() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI is missing. Create server/.env (copy server/.env.example).");
    return;
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("MongoDB connected");
  } catch (e) {
    console.error(`MongoDB connection failed: ${e.message}`);
    console.error("-> Start MongoDB locally, or put a MongoDB Atlas string in MONGO_URI (server/.env). Retrying in 5s...");
    clearTimeout(retryTimer);
    retryTimer = setTimeout(connect, 5000);
  }
}

mongoose.connection.on("disconnected", () => console.warn("MongoDB disconnected"));

module.exports = connect;
