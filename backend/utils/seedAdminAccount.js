const Admin = require("../models/Admin");
const User = require("../models/User");

const FIXED_ADMIN = {
  name: "altamash",
  email: "altamashmalik369@gmail.com",
  password: "6@18A26EE",
};

async function ensureAdminAccount() {
  const normalizedEmail = FIXED_ADMIN.email.trim().toLowerCase();

  await User.deleteMany({ email: normalizedEmail });
  await Admin.deleteMany({ email: { $ne: normalizedEmail } });

  const existingAdmin = await Admin.findOne({ email: normalizedEmail }).select(
    "+password"
  );

  if (!existingAdmin) {
    await Admin.create({
      name: FIXED_ADMIN.name,
      email: normalizedEmail,
      password: FIXED_ADMIN.password,
      role: "admin",
    });
    return;
  }

  existingAdmin.name = FIXED_ADMIN.name;
  existingAdmin.email = normalizedEmail;
  existingAdmin.password = FIXED_ADMIN.password;
  await existingAdmin.save();
}

module.exports = ensureAdminAccount;
