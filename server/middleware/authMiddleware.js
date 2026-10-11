import jwt from 'jsonwebtoken';
import { store } from '../services/dataStore.js';

const JWT_SECRET = process.env.JWT_SECRET || 'kinderhub-super-secret-jwt-key-2026';

export const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
      role: user.role, 
      name: user.name,
      assignedClassId: user.assignedClassId || null,
      childrenIds: user.childrenIds || []
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required. Please sign in.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired session. Please sign in again.' });
  }
};

export const requireRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthenticated access.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Forbidden: Access restricted. Requires one of [${roles.join(', ')}], but your role is [${req.user.role}].` 
      });
    }

    next();
  };
};
