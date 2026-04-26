module.exports = function roleMiddleware(requiredRole) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Hiányzó azonosító token.' });
    }
    // allow passing an array of accepted roles or a single role
    if (Array.isArray(requiredRole)) {
      if (requiredRole.includes(req.user.role)) return next();
    } else {
      if (req.user.role === requiredRole) return next();
    }
    return res.status(403).json({ error: 'Nincs jogosultsága az erőforráshoz.' });
  };
};
