const jwt = require("jsonwebtoken");
const {
  getModelByRole,
  findAccountByEmail,
  emailExists,
  findAccountById,
} = require("../utils/accountLookup");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");

const ADMIN_ACCOUNT = {
  name: "altamash",
  email: "altamashmalik369@gmail.com",
};

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "None" : "Lax",
  path: "/",
};

function attachAuthCookies(res, userId) {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  return res
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();

    if (await emailExists(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const AccountModel = getModelByRole("user");
    const user = await AccountModel.create({
      name: normalizedName,
      email: normalizedEmail,
      password,
      role: "user",
    });

    return attachAuthCookies(res, user._id).status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || "",
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const authUser = async (req, res) => {
  try {
    const { email, password, loginAs } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await findAccountByEmail(normalizedEmail, true);

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (loginAs === "admin" && user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "This account does not have admin access",
      });
    }

    if (
      user.role === "admin" &&
      user.email.toLowerCase() !== ADMIN_ACCOUNT.email
    ) {
      return res.status(403).json({
        success: false,
        message: "Only the configured admin account can sign in as admin",
      });
    }

    return attachAuthCookies(res, user._id).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || "",
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const refreshUserToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await findAccountById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    return attachAuthCookies(res, user._id).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || "",
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Refresh token expired or invalid",
    });
  }
};

const logoutUser = (req, res) => {
  return res
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json({
      success: true,
      message: "Logged out",
    });
};

module.exports = {
  registerUser,
  authUser,
  refreshUserToken,
  logoutUser,
};
