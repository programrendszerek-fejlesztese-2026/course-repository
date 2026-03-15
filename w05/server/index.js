const express = require('express');
const app = express();
const routes = require('./routes');
const PORT = 3000;

app.use(express.json());
app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ error: 'Nem található végpont.' });
});

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Receptgyűjtemény szerver fut a ${PORT}-es porton.`);
});
