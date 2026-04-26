// MongoDB initialization script for receptdb
// This script is executed by the official MongoDB image during container initialization.

db = db.getSiblingDB('receptdb');

// Create deterministic ObjectIds for seeds so references match
const user1 = ObjectId();
const user2 = ObjectId();

const cat1 = ObjectId();
const cat2 = ObjectId();
const cat3 = ObjectId();

const recipe1 = ObjectId();
const recipe2 = ObjectId();
const recipe3 = ObjectId();

// Users with pre-hashed bcrypt passwords
db.users.insertMany([
  {
    _id: user1,
    username: 'admin',
    email: 'admin@recept.hu',
    role: 'admin',
    password: '$2b$10$zmGcZceXHBvJuKAwFOavl.6yseuAJ.MYp28qYhNWJ/a.TimoyWGCC',
    createdAt: new Date()
  },
  {
    _id: user2,
    username: 'pista',
    email: 'pista@recept.hu',
    role: 'user',
    password: '$2b$10$TaSUwUtX.WVbp7BCTVrEN.wjkJiz11x.y4a8MKh3tCe.P9JlnFi5O',
    createdAt: new Date()
  }
]);

// Categories (use _id so recipes can reference them as ObjectId)
db.categories.insertMany([
  { _id: cat1, name: 'Leves', description: 'Meleg levesek és krémlevesek' },
  { _id: cat2, name: 'Főétel', description: 'Húsos és vegetáriánus főételek' },
  { _id: cat3, name: 'Desszert', description: 'Édes sütemények és desszertek' }
]);

// Recipes (categoryId and createdBy reference the ObjectIds above)
db.recipes.insertMany([
  {
    _id: recipe1,
    title: 'Gulyásleves',
    description: 'Magyar klasszikus marhahúsból, zöldségekkel.',
    categoryId: cat1,
    ingredients: [
      { name: 'marhahús', quantity: '500 g' },
      { name: 'burgonya', quantity: '3 db' },
      { name: 'sárgarépa', quantity: '2 db' }
    ],
    createdBy: user1,
    createdAt: new Date()
  },
  {
    _id: recipe2,
    title: 'Rántott hús',
    description: 'Sertéshús panírozva, olajban sütve.',
    categoryId: cat2,
    ingredients: [
      { name: 'sertéshús', quantity: '4 szelet' },
      { name: 'tojás', quantity: '2 db' },
      { name: 'zsemlemorzsa', quantity: '100 g' }
    ],
    createdBy: user2,
    createdAt: new Date()
  },
  {
    _id: recipe3,
    title: 'Somlói galuska',
    description: 'Híres magyar desszert piskótával és csokoládéval.',
    categoryId: cat3,
    ingredients: [
      { name: 'piskóta', quantity: '3 szelet' },
      { name: 'csokoládé', quantity: '50 g' },
      { name: 'tejszín', quantity: '100 ml' }
    ],
    createdBy: user1,
    createdAt: new Date()
  }
]);

// Ratings
db.ratings.insertMany([
  { _id: ObjectId(), userId: user2, recipeId: recipe1, score: 5, comment: 'Nagyon finom!', createdAt: new Date() },
  { _id: ObjectId(), userId: user1, recipeId: recipe2, score: 4, comment: 'Jól sikerült, de lehetne kevésbé olajos.', createdAt: new Date() }
]);

print('Mongo init script finished.');
