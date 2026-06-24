const jwt = require('jsonwebtoken');

// 1. SEQUENCE: Periksa header 'Authorization' skema 'Bearer'. Tolak jika absen.
//    Ekstrak payload dan verifikasi dengan algoritma HS256 yang statis.
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token tidak ditemukan atau skema tidak valid' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token tidak valid' });
  }
};

const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Akses ditolak' });
  }
  next();
};

module.exports = {
  authenticate,
  authorize,
};
