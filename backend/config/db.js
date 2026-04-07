const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("=================================");
    console.log("ðŸ“¦ MongoDB Connected Successfully");
    console.log(`ðŸŒ Host: ${conn.connection.host}`);
    console.log(`ðŸ—„ï¸ Database: ${conn.connection.name}`);
    console.log("=================================");

  } catch (error) {
    console.error("=================================");
    console.error("âŒ DATABASE CONNECTION FAILED");
    console.error(error.message);
    console.error("=================================");

    // Critical failure â†’ stop server
    process.exit(1);
  }
};

module.exports = connectDB;