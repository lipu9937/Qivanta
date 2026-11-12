require("dotenv").config();
const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const crud = require("./utils/crud");
const { Service, Project, Testimonial, TeamMember } = require("./models");

const app = express();
connectDB();

// Behind Render/Railway/Vercel proxies: needed for rate limiting and correct client IPs
app.set("trust proxy", 1);

// Helmet's default CSP only allows images from this server, which hides project/team/blog
// images hosted elsewhere (Cloudinary etc.). Allow https images; keep everything else default.
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: { "img-src": ["'self'", "data:", "https:"] },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CLIENT_URL may hold several origins separated by commas. Local dev origins are always allowed.
const allowed = [
  ...(process.env.CLIENT_URL || "").split(",").map((s) => s.trim().replace(/\/$/, "")).filter(Boolean),
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];
app.use(
  cors({
    origin: (origin, cb) => cb(null, !origin || allowed.includes(origin)),
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

app.get("/api/health", (req, res) =>
  res.json({ status: "ok", database: mongoose.connection.readyState === 1 ? "connected" : "disconnected" })
);

// Fail fast with a clear message when MongoDB is down, instead of hanging for ~10 seconds
app.use("/api", (req, res, next) =>
  mongoose.connection.readyState === 1
    ? next()
    : res.status(503).json({ message: "Database is not connected. Start MongoDB or check MONGO_URI in server/.env." })
);

app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }), require("./routes/auth"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/leads", require("./routes/leads"));
app.use("/api", require("./routes/misc")); // /subscribe, /stats
app.use("/api/services", crud(Service, { filter: { isActive: true }, sort: { createdAt: 1 }, bySlug: true }));
app.use("/api/projects", crud(Project, { sort: { featured: -1, createdAt: -1 } }));
app.use("/api/testimonials", crud(Testimonial));
app.use("/api/team", crud(TeamMember, { sort: { order: 1 } }));
app.use("/api", (req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` }));

// Integrated mode: if the client has been built, Express serves it too (one server, one port)
const dist = path.join(__dirname, "../client/dist");
if (fs.existsSync(path.join(dist, "index.html"))) {
  app.use(express.static(dist));
  app.get("*", (req, res) => res.sendFile(path.join(dist, "index.html")));
} else {
  // Dev mode: the website runs on the Vite server, so "/" on this port has no page.
  const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").split(",")[0].trim();
  app.get("/", (req, res) =>
    res.type("html").send(
      `<h2>QIVANTA API is running</h2>
       <p>This port only serves the API. Open the website at <a href="${clientUrl}">${clientUrl}</a>.</p>
       <p>Health check: <a href="/api/health">/api/health</a></p>
       <p>To serve the site from this port, run <code>npm run build</code> and restart.</p>`
    )
  );
}

app.use(errorHandler);

const port = process.env.PORT || 5000;
app
  .listen(port, () => console.log(`Server running on http://localhost:${port}`))
  .on("error", (e) => {
    console.error(
      e.code === "EADDRINUSE"
        ? `Port ${port} is already in use. Change PORT in server/.env and the proxy target in client/vite.config.js.`
        : e
    );
    process.exit(1);
  });
