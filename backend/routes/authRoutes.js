const express = require("express");
const {
  registerUser,
  authUser,
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

router.post("/register", registerUser);
router.post("/login", authUser);

module.exports = router;
