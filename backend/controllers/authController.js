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
    const { name, email, password, role } = req.body;

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

    const normalizedRole = role === "admin" ? "admin" : "user";

    if (await emailExists(email)) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const AccountModel = getModelByRole(normalizedRole);
    const user = await AccountModel.create({
      name,
      email,
      password,
      role: normalizedRole,
    });

    return attachAuthCookies(res, user._id).status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await findAccountByEmail(email, true);

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    return attachAuthCookies(res, user._id).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
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
