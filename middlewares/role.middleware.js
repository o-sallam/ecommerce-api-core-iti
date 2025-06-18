// role.middleware.js
// Middleware to restrict access based on user roles

function permit(...allowedRoles) {
  return (req, res, next) => {
    // Assumes req.user is set by authentication middleware
    const user = req.user;
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient role" });
    }
    next();
  };
}

module.exports = { permit };
