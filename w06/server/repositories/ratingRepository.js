// Értékelések in-memory repository
const ratings = [
  {
    id: '1',
    userId: '2',
    recipeId: '1',
    score: 5,
    comment: 'Nagyon finom!',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    userId: '1',
    recipeId: '2',
    score: 4,
    comment: 'Jól sikerült, de lehetne kevésbé olajos.',
    createdAt: new Date().toISOString()
  }
];

let nextId = 3;

module.exports = {
  findAll() {
    return ratings;
  },
  findById(id) {
    return ratings.find(r => r.id === id);
  },
  create(data) {
    const newRating = { id: String(nextId++), ...data, createdAt: new Date().toISOString() };
    ratings.push(newRating);
    return newRating;
  },
  update(id, data) {
    const idx = ratings.findIndex(r => r.id === id);
    if (idx === -1) return null;
    ratings[idx] = { ...ratings[idx], ...data };
    return ratings[idx];
  },
  delete(id) {
    const idx = ratings.findIndex(r => r.id === id);
    if (idx === -1) return false;
    ratings.splice(idx, 1);
    return true;
  },
  findByRecipeId(recipeId) {
    return ratings.filter(r => r.recipeId === recipeId);
  },
  findByUserId(userId) {
    return ratings.filter(r => r.userId === userId);
  }
};
