const express = require('express');
const router = express.Router();
const categoryService = require('../services/categoryService');

router.get('/categories', (req, res) => {
  try {
    const categories = categoryService.findAll();
    res.status(200).json(categories);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.get('/categories/:id', (req, res) => {
  try {
    const category = categoryService.findById(req.params.id);
    res.status(200).json(category);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.post('/categories', (req, res) => {
  try {
    const newCat = categoryService.create(req.body);
    res.status(201).json(newCat);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.put('/categories/:id', (req, res) => {
  try {
    const updated = categoryService.update(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.delete('/categories/:id', (req, res) => {
  try {
    categoryService.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

module.exports = router;
