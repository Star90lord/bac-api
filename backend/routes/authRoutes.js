const express = require("express");
const { authLimiter } = require("../middleware/rateLimiter");
const {
  registerUser,
  authUser,
  refreshUserToken,
  logoutUser,
} = require("../controllers/authController");

const router = express.Router();

/**
 * =========================
 * AUTH ROUTES (CLEAN DESIGN)
 * =========================
 *
 * POST   /api/auth/register  → register new user
 * POST   /api/auth/login     → login user
 */

router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, authUser);
router.post("/refresh", refreshUserToken);
router.post("/logout", logoutUser);

module.exports = router;
