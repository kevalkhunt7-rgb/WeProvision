const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { readDb, writeDb } = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');
const User = require('../models/User');

// Helper to hash password using Node's built-in crypto
const hashPassword = (password) => {
  return crypto.pbkdf2Sync(password, 'weprovision_salt_2026', 1000, 64, 'sha512').toString('hex');
};

const verifyPassword = (password, hashedPassword) => {
  if (!hashedPassword) return false;
  // Support plain text fallback for initial development seed if needed
  if (password === hashedPassword) return true;
  const hash = hashPassword(password);
  return hash === hashedPassword;
};

exports.hashPassword = hashPassword;

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = null;

    // 1. Try finding in MongoDB if Mongoose is connected
    try {
      if (User.db && User.db.readyState === 1) {
        user = await User.findOne({ email: cleanEmail });
      }
    } catch (e) {
      console.warn('MongoDB query fallback to local DB store:', e.message);
    }

    // 2. Fallback to readDb() local JSON store
    if (!user) {
      const db = readDb();
      const users = db.users || [];
      user = users.find((u) => u.email.toLowerCase() === cleanEmail);
    }

    // Check user existence
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'You are not a Admin',
      });
    }

    // Verify password
    const isMatch = verifyPassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.',
      });
    }

    // ENFORCE ADMIN ROLE CHECK
    if (user.role !== 'admin' && user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: `Access denied. Account role is '${user.role}'. Only users with 'admin' role can log in to the Admin Panel.`,
      });
    }

    // Generate JWT Token
    const payload = {
      id: user.id || user._id,
      name: user.name || 'Admin User',
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Admin authentication successful',
      token,
      user: {
        id: payload.id,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      },
    });
  } catch (error) {
    console.error('❌ Auth Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication.',
    });
  }
};

exports.getMe = (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
};

