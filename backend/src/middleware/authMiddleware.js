const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'weprovision_secret_key_2026';

const verifyAdminToken = (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Verify role is admin or superadmin
    if (!decoded || (decoded.role !== 'admin' && decoded.role !== 'superadmin')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.',
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
    });
  }
};

module.exports = {
  verifyAdminToken,
  JWT_SECRET,
};
