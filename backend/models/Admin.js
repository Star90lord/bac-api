const mongoose = require("mongoose");
const createAccountSchema = require("./accountSchema");

const adminSchema = createAccountSchema("admin");

module.exports = mongoose.models.Admin || mongoose.model("Admin", adminSchema, "admins");
