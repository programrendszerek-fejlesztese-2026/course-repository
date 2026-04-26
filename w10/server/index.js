const express = require('express');
const app = express();
const routes = require('./routes');
const db = require('./db');

const PORT = process.env.PORT || 3000;

app.use(express.json());
// Simple CORS support for development (allow Angular dev server)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});
app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ error: 'Nem található végpont.' });
});

async function start() {
  try {
    const connectedDb = await db.connect();
    app.locals.db = connectedDb;
    app.listen(PORT, () => {
      console.log(`Receptgyűjtemény szerver fut a ${PORT}-es porton.`);
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  try {
    await db.close();
    console.log('MongoDB connection closed');
  } catch (e) {
    // ignore
  }
  process.exit(0);
});

start();
