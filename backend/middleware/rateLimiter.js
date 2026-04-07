const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests, please try again later",
  },

  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Too many requests from this IP, please try again later",
    });
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // very strict

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many login attempts. Try again later.",
  },

  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Too many authentication attempts, slow down",
    });
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
};