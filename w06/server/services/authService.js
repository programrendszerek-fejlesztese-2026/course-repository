const userRepo = require('../repositories/userRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';

module.exports = {
  login({ email, password }) {
    if (!email || !password) throw { status: 400, message: 'E-mail és jelszó kötelező.' };
    const user = userRepo.findByEmail(email);
    if (!user) throw { status: 401, message: 'Érvénytelen adatok.' };
    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) throw { status: 401, message: 'Érvénytelen adatok.' };
    const payload = { id: user.id, username: user.username, role: user.role };
    const token = jwt.sign(payload, SECRET, { expiresIn: '7d' });
    return { token, user: payload };
  },
  verifyToken(token) {
    return jwt.verify(token, SECRET);
  }
};
