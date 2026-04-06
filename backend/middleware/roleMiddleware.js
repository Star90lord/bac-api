const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    // 1. ENSURE USER EXISTS (must come from protect middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // 2. ENSURE ROLE EXISTS
    if (!req.user.role) {
      return res.status(403).json({
        success: false,
        message: "User role not defined",
      });
    }

    // 3. CHECK ROLE AUTHORIZATION
    const hasAccess = allowedRoles.includes(req.user.role);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource",
      });
    }

    next();
  };
};

module.exports = { checkRole };