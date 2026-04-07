const User = require("../models/User");
const Admin = require("../models/Admin");

function getModelByRole(role) {
  return role === "admin" ? Admin : User;
}

async function findAccountByEmail(email, includePassword = false) {
  const querySuffix = includePassword ? "+password" : "-password";

  const admin = await Admin.findOne({ email }).select(querySuffix);
  if (admin) {
    return admin;
  }

  return User.findOne({ email }).select(querySuffix);
}

async function emailExists(email) {
  const [admin, user] = await Promise.all([
    Admin.exists({ email }),
    User.exists({ email }),
  ]);

  return Boolean(admin || user);
}

async function findAccountById(id, role) {
  if (role) {
    const account = await getModelByRole(role).findById(id).select("-password");
    if (account) {
      return account;
    }
  }

  const admin = await Admin.findById(id).select("-password");
  if (admin) {
    return admin;
  }

  return User.findById(id).select("-password");
}

async function listAllAccounts() {
  const [admins, users] = await Promise.all([
    Admin.find().select("-password"),
    User.find().select("-password"),
  ]);

  return [
    ...admins.map((account) => ({ ...account.toObject(), collection: "admins" })),
    ...users.map((account) => ({ ...account.toObject(), collection: "users" })),
  ];
}

module.exports = {
  getModelByRole,
  findAccountByEmail,
  emailExists,
  findAccountById,
  listAllAccounts,
};
