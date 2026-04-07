const { findAccountById } = require("../utils/accountLookup");

const getUserProfile = async (req, res) => {
  try {
    // AUTH CHECK
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const user = await findAccountById(req.user.id, req.user.role);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        collection: user.role === "admin" ? "admins" : "users",
      },
    });
  } catch (error) {
    console.error("Get User Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
    });
  }
};

module.exports = { getUserProfile };
