import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';


export const protect = async (req, res, next) => {
  try {
    let token = null;

    // Extract token
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, token missing' });
    }

    // Decode and verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user and include role
    const user = await User.findById(decoded.id).select('name email role');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(440).json({ message: 'Session expired or invalid token' });
  }
};

// export const isAdmin = (req, res, next) => {
//   if (req.user?.role === 'admin') {
//     next();
//   } else {
//     res.status(403).json({ message: 'Admin access denied' });
//   }
// };

export const isAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
    return next();
  }
  return res.status(403).json({ message: 'Admin access denied' });
};


export const isSuperAdmin = (req, res, next) => {
  if (req.user?.role === 'superadmin') {
    next();
  } else {
    res.status(403).json({ message: 'Super admin access denied' });
  }
};

// middleware/role.js
export const isCaretaker = (req, res, next) => {
  if (!req.user || req.user.role !== "caretaker") {
    return res.status(403).json({ message: "Forbidden – caretaker admin only" });
  }
  next();
};

