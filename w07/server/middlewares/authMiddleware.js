const authService = require('../services/authService');

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Hiányzó azonosító token.' });
  }
  const token = auth.substring(7);
  try {
    const payload = authService.verifyToken(token);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Érvénytelen vagy lejárt token.' });
  }
};
