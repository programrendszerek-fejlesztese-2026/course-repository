const express = require('express');
const router = express.Router();
const categoryService = require('../services/categoryService');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');

router.get('/categories', async (req, res) => {
  try {
    const categories = await categoryService.findAll();
    res.status(200).json(categories);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.get('/categories/:id', async (req, res) => {
  try {
    const category = await categoryService.findById(req.params.id);
    res.status(200).json(category);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.post('/categories', auth, role('admin'), async (req, res) => {
  try {
    const newCat = await categoryService.create(req.body);
    res.status(201).json(newCat);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.put('/categories/:id', auth, role('admin'), async (req, res) => {
  try {
    const updated = await categoryService.update(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.delete('/categories/:id', auth, role('admin'), async (req, res) => {
  try {
    await categoryService.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

module.exports = router;
