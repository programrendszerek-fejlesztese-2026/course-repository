// Kategóriák in-memory repository
const categories = [
  { id: '1', name: 'Leves', description: 'Meleg levesek és krémlevesek' },
  { id: '2', name: 'Főétel', description: 'Húsos és vegetáriánus főételek' },
  { id: '3', name: 'Desszert', description: 'Édes sütemények és desszertek' }
];

let nextId = 4;

module.exports = {
  findAll() {
    return categories;
  },
  findById(id) {
    return categories.find(cat => cat.id === id);
  },
  create(data) {
    const newCat = { id: String(nextId++), ...data };
    categories.push(newCat);
    return newCat;
  },
  update(id, data) {
    const idx = categories.findIndex(cat => cat.id === id);
    if (idx === -1) return null;
    categories[idx] = { ...categories[idx], ...data };
    return categories[idx];
  },
  delete(id) {
    const idx = categories.findIndex(cat => cat.id === id);
    if (idx === -1) return false;
    categories.splice(idx, 1);
    return true;
  }
};
