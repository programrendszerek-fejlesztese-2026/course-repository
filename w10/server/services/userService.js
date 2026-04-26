const userRepo = require('../repositories/userRepository');
const bcrypt = require('bcrypt');

module.exports = {
  async findAll() {
    return await userRepo.findAll();
  },
  async findById(id) {
    const user = await userRepo.findById(id);
    if (!user) throw { status: 404, message: 'Felhasználó nem található.' };
    return user;
  },
  async create(data) {
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
    const existing = await userRepo.findByEmail(data.email);
    if (existing) {
      throw { status: 409, message: 'Az e-mail már létezik.' };
    }
    // Hash the password before creating the user
    const hashed = bcrypt.hashSync(data.password, 10);
    const toCreate = { ...data, password: hashed };
    return await userRepo.create(toCreate);
  },
  async update(id, data) {
    if (data.username !== undefined && data.username.trim() === '') {
      throw { status: 400, message: 'A felhasználónév nem lehet üres.' };
    }
    // If updating password, hash it
    const updatedData = { ...data };
    if (updatedData.password) {
      updatedData.password = bcrypt.hashSync(updatedData.password, 10);
    }
    const updated = await userRepo.update(id, updatedData);
    if (!updated) throw { status: 404, message: 'Felhasználó nem található.' };
    return updated;
  },
  async changePassword(id, actor, currentPassword, newPassword) {
    // actor: { id }
    const user = await userRepo.findById(id);
    if (!user) throw { status: 404, message: 'Felhasználó nem található.' };
    // Only owner can change password (role-based checks removed)
    if (actor.id !== id) {
      throw { status: 403, message: 'Nincs jogosultsága megváltoztatni a jelszót.' };
    }
    // Require currentPassword for owner
    if (!currentPassword) throw { status: 400, message: 'A jelenlegi jelszó kötelező.' };
    const ok = bcrypt.compareSync(currentPassword, user.password);
    if (!ok) throw { status: 401, message: 'A jelenlegi jelszó hibás.' };
    if (!newPassword) throw { status: 400, message: 'Az új jelszó kötelező.' };
    const hashed = bcrypt.hashSync(newPassword, 10);
    const updated = await userRepo.update(id, { password: hashed });
    if (!updated) throw { status: 500, message: 'Hiba a jelszó frissítésekor.' };
    return { message: 'Jelszó sikeresen frissítve.' };
  },
  async delete(id) {
    const ok = await userRepo.delete(id);
    if (!ok) throw { status: 404, message: 'Felhasználó nem található.' };
    return true;
  },
  async findByEmail(email) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw { status: 404, message: 'Felhasználó nem található.' };
    return user;
  }
};
