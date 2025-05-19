const jwt = require('jsonwebtoken');

// Middleware untuk validasi token JWT dan menambahkan user ke req.user
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ message: 'Login required' });
  console.log("🧠 Decoded user from token:", req.user);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username, role }
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Middleware untuk cek role yang diizinkan, menerima array role
const authorizeRole = (roles = []) => {
  // Jika hanya 1 role string, ubah jadi array
  if (typeof roles === 'string') {
    roles = [roles];
  }
  
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Login required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient role' });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRole,
};
