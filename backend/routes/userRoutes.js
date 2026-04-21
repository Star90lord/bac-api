const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { checkRole } = require("../middleware/roleMiddleware");
const { listAllAccounts } = require("../utils/accountLookup");

const router = express.Router();

router.get("/me", protect, getUserProfile);
router.put("/me", protect, updateUserProfile);

/**
 * GET ALL USERS (ADMIN ONLY)
 * Frontend expects:
 * window.apiClient.getAllUsers(token)
 */
router.get("/all", protect, checkRole("admin"), async (req, res) => {
  try {
    const users = await listAllAccounts();

    res.json({
      success: true,
      data: users.map((u) => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        collection: u.collection,
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
