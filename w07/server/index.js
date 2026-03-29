const express = require('express');
const app = express();
const routes = require('./routes');
const db = require('./db');

const PORT = process.env.PORT || 3000;

app.use(express.json());
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
