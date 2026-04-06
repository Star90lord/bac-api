const mongoose = require("mongoose");

/**
 * =========================
 * DATABASE CONNECTION
 * =========================
 * - Uses modern mongoose (v6+ / v7+)
 * - No deprecated options
 * - Safe error handling
 * - Clean logging for debugging
 */

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("=================================");
    console.log("📦 MongoDB Connected Successfully");
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(`🗄️ Database: ${conn.connection.name}`);
    console.log("=================================");

  } catch (error) {
    console.error("=================================");
    console.error("❌ DATABASE CONNECTION FAILED");
    console.error(error.message);
    console.error("=================================");

    // Critical failure → stop server
    process.exit(1);
  }
};

module.exports = connectDB;