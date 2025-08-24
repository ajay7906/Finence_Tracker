import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ msg: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, 'ABCD1234!@#$%'); // 👈 replace with process.env.JWT_SECRET in production
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Access denied. Insufficient permissions." });
    }
    next();
  };
};


// Role-based access control middleware
 const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        msg: "Authentication required" 
      });
    }
    
    if (req.user.role !== role && req.user.role !== "admin") {
      return res.status(403).json({ 
        success: false,
        msg: "Insufficient permissions" 
      });
    }
    
    next();
  };
};

export { authenticate, authorize, requireRole };