// Felhasználók in-memory repository
const users = [
  { id: '1', username: 'admin', email: 'admin@recept.hu', role: 'admin', password: 'admin123', createdAt: new Date().toISOString() },
  { id: '2', username: 'pista', email: 'pista@recept.hu', role: 'user', password: 'pista123', createdAt: new Date().toISOString() }
];

let nextId = 3;

module.exports = {
  findAll() {
    return users;
  },
  findById(id) {
    return users.find(u => u.id === id);
  },
  create(data) {
    const newUser = { id: String(nextId++), ...data, createdAt: new Date().toISOString() };
    users.push(newUser);
    return newUser;
  },
  update(id, data) {
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...data };
    return users[idx];
  },
  delete(id) {
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return false;
    users.splice(idx, 1);
    return true;
  },
  findByEmail(email) {
    return users.find(u => u.email === email);
  }
};
