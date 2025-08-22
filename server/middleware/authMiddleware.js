const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes by verifying JWT
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Attach user to the request, excluding the hashed password
      req.user = await User.findById(decoded.id).select("-password_hash");
      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Middleware to restrict access to admin users
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

// Middleware to restrict access to agents and admins
const agent = (req, res, next) => {
  if (req.user && (req.user.role === "agent" || req.user.role === "admin")) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an agent or admin" });
  }
};

module.exports = { protect, admin, agent };
