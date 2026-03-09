// Receptek in-memory repository
const recipes = [
  {
    id: '1',
    title: 'Gulyásleves',
    description: 'Magyar klasszikus marhahúsból, zöldségekkel.',
    categoryId: '1',
    ingredients: [
      { name: 'marhahús', quantity: '500 g' },
      { name: 'burgonya', quantity: '3 db' },
      { name: 'sárgarépa', quantity: '2 db' }
    ],
    createdBy: '1',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Rántott hús',
    description: 'Sertéshús panírozva, olajban sütve.',
    categoryId: '2',
    ingredients: [
      { name: 'sertéshús', quantity: '4 szelet' },
      { name: 'tojás', quantity: '2 db' },
      { name: 'zsemlemorzsa', quantity: '100 g' }
    ],
    createdBy: '2',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Somlói galuska',
    description: 'Híres magyar desszert piskótával és csokoládéval.',
    categoryId: '3',
    ingredients: [
      { name: 'piskóta', quantity: '3 szelet' },
      { name: 'csokoládé', quantity: '50 g' },
      { name: 'tejszín', quantity: '100 ml' }
    ],
    createdBy: '1',
    createdAt: new Date().toISOString()
  }
];

let nextId = 4;

module.exports = {
  findAll() {
    return recipes;
  },
  findById(id) {
    return recipes.find(r => r.id === id);
  },
  create(data) {
    const newRecipe = { id: String(nextId++), ...data, createdAt: new Date().toISOString() };
    recipes.push(newRecipe);
    return newRecipe;
  },
  update(id, data) {
    const idx = recipes.findIndex(r => r.id === id);
    if (idx === -1) return null;
    recipes[idx] = { ...recipes[idx], ...data };
    return recipes[idx];
  },
  delete(id) {
    const idx = recipes.findIndex(r => r.id === id);
    if (idx === -1) return false;
    recipes.splice(idx, 1);
    return true;
  },
  findByCategoryId(categoryId) {
    return recipes.filter(r => r.categoryId === categoryId);
  }
};
