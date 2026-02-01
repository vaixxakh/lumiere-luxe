const adminOnly = (req, res, next) => {
  try {
    
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "Admin access only" });
    }

    next();
  } catch (err) {
    return res.status(500).json({ message: "Admin authorization failed" });
  }
};

module.exports = adminOnly;