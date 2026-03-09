const userRepo = require('../repositories/userRepository');

module.exports = {
  findAll() {
    return userRepo.findAll();
  },
  findById(id) {
    const user = userRepo.findById(id);
    if (!user) throw { status: 404, message: 'Felhasználó nem található.' };
    return user;
  },
  create(data) {
    if (!data.username || data.username.trim() === '') {
      throw { status: 400, message: 'A felhasználónév kötelező.' };
    }
    if (!data.email) {
      throw { status: 400, message: 'Az e-mail kötelező.' };
    }
    if (!data.password) {
      throw { status: 400, message: 'A jelszó kötelező.' };
    }
    // E-mail egyediség
    const existing = userRepo.findByEmail(data.email);
    if (existing) {
      throw { status: 409, message: 'Az e-mail már létezik.' };
    }
    return userRepo.create(data);
  },
  update(id, data) {
    if (data.username !== undefined && data.username.trim() === '') {
      throw { status: 400, message: 'A felhasználónév nem lehet üres.' };
    }
    const updated = userRepo.update(id, data);
    if (!updated) throw { status: 404, message: 'Felhasználó nem található.' };
    return updated;
  },
  delete(id) {
    const ok = userRepo.delete(id);
    if (!ok) throw { status: 404, message: 'Felhasználó nem található.' };
    return true;
  },
  findByEmail(email) {
    const user = userRepo.findByEmail(email);
    if (!user) throw { status: 404, message: 'Felhasználó nem található.' };
    return user;
  }
};
