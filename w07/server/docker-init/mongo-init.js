// MongoDB initialization script for receptdb
// This script is executed by the official MongoDB image during container initialization.

db = db.getSiblingDB('receptdb');

// Users with pre-hashed bcrypt passwords
db.users.insertMany([
  {
    id: '1',
    username: 'admin',
    email: 'admin@recept.hu',
    role: 'admin',
    password: '$2b$10$zmGcZceXHBvJuKAwFOavl.6yseuAJ.MYp28qYhNWJ/a.TimoyWGCC',
    createdAt: new Date()
  },
  {
    id: '2',
    username: 'pista',
    email: 'pista@recept.hu',
    role: 'user',
    password: '$2b$10$TaSUwUtX.WVbp7BCTVrEN.wjkJiz11x.y4a8MKh3tCe.P9JlnFi5O',
    createdAt: new Date()
  }
]);

// Categories
db.categories.insertMany([
  { id: '1', name: 'Leves', description: 'Meleg levesek és krémlevesek' },
  { id: '2', name: 'Főétel', description: 'Húsos és vegetáriánus főételek' },
  { id: '3', name: 'Desszert', description: 'Édes sütemények és desszertek' }
]);

// Recipes
db.recipes.insertMany([
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
    createdAt: new Date()
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
    createdAt: new Date()
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
    createdAt: new Date()
  }
]);

// Ratings
db.ratings.insertMany([
  { id: '1', userId: '2', recipeId: '1', score: 5, comment: 'Nagyon finom!', createdAt: new Date() },
  { id: '2', userId: '1', recipeId: '2', score: 4, comment: 'Jól sikerült, de lehetne kevésbé olajos.', createdAt: new Date() }
]);

print('Mongo init script finished.');
