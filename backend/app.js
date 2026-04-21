const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const { apiLimiter } = require("./middleware/rateLimiter");

// Create app
const app = express();
app.set("trust proxy", 1);

function normalizeOrigin(origin) {
  return String(origin || "")
    .trim()
    .replace(/\/+$/, "");
}

function parseConfiguredOrigins(...values) {
  return values
    .filter(Boolean)
    .flatMap((value) => String(value).split(/[,\n]/))
    .map(normalizeOrigin)
    .filter(Boolean);
}

const allowedOrigins = [
  ...parseConfiguredOrigins(process.env.FRONTEND_URL, process.env.FRONTEND_URLS),
  "https://rbac-api.vercel.app",
  "https://bac-api-ybmy.vercel.app",
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "http://127.0.0.1:3000",
  "http://localhost:3000",
]
  .map(normalizeOrigin)
  .filter(Boolean);

function isProjectVercelPreview(origin) {
  try {
    const { protocol, hostname } = new URL(origin);

    if (protocol !== "https:") {
      return false;
    }

    return /^(bac-api|rbac-api)(-[a-z0-9-]+)?\.vercel\.app$/i.test(hostname);
  } catch (error) {
    return false;
  }
}

function isAllowedOrigin(origin) {
  const normalizedOrigin = normalizeOrigin(origin);

  if (!normalizedOrigin) {
    return true;
  }

  if (allowedOrigins.includes(normalizedOrigin)) {
    return true;
  }

  return isProjectVercelPreview(normalizedOrigin);
}

const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS origin not allowed"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 204,
};

// ======================
// MIDDLEWARE
// ======================

app.use(cors(corsOptions));

// Allow JSON body parsing with increased limit for image uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(apiLimiter);

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
