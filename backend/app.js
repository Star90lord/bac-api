const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const { apiLimiter } = require("./middleware/rateLimiter");

// Create app
const app = express();

// ======================
// MIDDLEWARE
// ======================

// Allow JSON body parsing
app.use(express.json());
app.use(cookieParser());
app.use(apiLimiter);

// FIX: CORS (development safe)
app.use(
  cors({
    origin: [
      "http://127.0.0.1:5500",
      "http://localhost:5500",
      "http://127.0.0.1:3000",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Optional: request logger (helps debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ======================
// ROUTES
// ======================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// ======================
// HEALTH CHECK
// ======================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running successfully",
  });
});

// ======================
// HANDLE UNKNOWN ROUTES
// ======================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ======================
// GLOBAL ERROR HANDLER
// ======================
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
