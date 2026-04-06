const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * AUTH MIDDLEWARE (PROTECT ROUTES)
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. CHECK HEADER EXISTS
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // 2. EXTRACT TOKEN
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    // 3. VERIFY TOKEN
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // 4. FETCH USER FROM DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // 5. ATTACH CLEAN USER OBJECT (frontend-friendly)
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error in authentication",
    });
  }
};

module.exports = { protect };