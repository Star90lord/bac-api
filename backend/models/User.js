const mongoose = require("mongoose");
const createAccountSchema = require("./accountSchema");

const userSchema = createAccountSchema("user");

/**
 * 🔥 FIXED: Password hashing middleware
 * - ONLY ONE hook (no duplicates allowed)
 * - correct `next` usage
 * - no arrow function
 */
 

/**
 * 🔐 Password comparison method
 */
module.exports = mongoose.models.User || mongoose.model("User", userSchema, "users");
