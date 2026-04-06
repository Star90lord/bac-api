const express = require("express");
const { getUserProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { checkRole } = require("../middleware/roleMiddleware");
const User = require("../models/User");

const router = express.Router();

router.get("/me", protect, getUserProfile);

/**
 * GET ALL USERS (ADMIN ONLY)
 * Frontend expects:
 * window.apiClient.getAllUsers(token)
 */
router.get("/all", protect, checkRole("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json({
      success: true,
      data: users.map((u) => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    });
  }
});

module.exports = router;
