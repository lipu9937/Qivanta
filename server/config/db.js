// const mongoose = require("mongoose");

// Keeps the API alive even when MongoDB is down, and keeps retrying.
// (Before, the whole server exited, so the website could not load any data.)
// let retryTimer;

// async function connect() {
//   const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/qivanta";
//   if (!uri) {
//     console.error("MONGO_URI is missing. Create server/.env (copy server/.env.example).");
//     return;
//   }
//   try {
//     await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
//     console.log("MongoDB connected");
//   } catch (e) {
//     console.error(`MongoDB connection failed: ${e.message}`);
//     console.error("-> Start MongoDB locally, or put a MongoDB Atlas string in MONGO_URI (server/.env). Retrying in 5s...");
//     clearTimeout(retryTimer);
//     retryTimer = setTimeout(connect, 5000);
//   }
// }




const mongoose = require("mongoose");

async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI is not configured");
    }

    console.log("Connecting to MongoDB Atlas...");

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });

    console.log("MongoDB Atlas Connected Successfully!");

  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;



// mongoose.connection.on("disconnected", () => console.warn("MongoDB disconnected"));

// module.exports = connect;
