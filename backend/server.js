const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = require("./app");
const connectDB = require("./config/db");

/**
 * =========================
 * HANDLE SYNC ERRORS
 * =========================
 */
process.on("uncaughtException", (err) => {
  console.error("=================================");
  console.error("❌ UNCAUGHT EXCEPTION");
  console.error(`${err.name}: ${err.message}`);
  console.error("=================================");
  process.exit(1);
});

let server;

/**
 * =========================
 * START APPLICATION
 * =========================
 */
const startServer = async () => {
  try {
    // DB CONNECTION (clean modern mongoose - no deprecated options)
    await connectDB();

    const PORT = process.env.PORT || 5000;

    server = app.listen(PORT, () => {
      console.log("=================================");
      console.log(`🚀 Server running on port ${PORT}`);
      console.log("=================================");
    });

  } catch (error) {
    console.error("=================================");
    console.error("❌ SERVER START FAILED");
    console.error(error.message);
    console.error("=================================");
    process.exit(1);
  }
};

/**
 * =========================
 * HANDLE ASYNC ERRORS
 * =========================
 */
process.on("unhandledRejection", (err) => {
  console.error("=================================");
  console.error("❌ UNHANDLED PROMISE REJECTION");
  console.error(`${err.name}: ${err.message}`);
  console.error("=================================");

  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

/**
 * =========================
 * GRACEFUL SHUTDOWN
 * =========================
 */
process.on("SIGTERM", () => {
  console.log("=================================");
  console.log("⚠️ SIGTERM RECEIVED - Shutting down...");
  console.log("=================================");

  if (server) {
    server.close(() => {
      console.log("Process terminated");
    });
  }
});

/**
 * START APP
 */
startServer();
