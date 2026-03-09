const express = require('express');
const router = express.Router();
const recipeService = require('../services/recipeService');

router.get('/recipes', (req, res) => {
  try {
    const recipes = recipeService.findAll(req.query.category);
    res.status(200).json(recipes);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.get('/recipes/:id', (req, res) => {
  try {
    const recipe = recipeService.findById(req.params.id);
    res.status(200).json(recipe);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.post('/recipes', (req, res) => {
  try {
    const newRecipe = recipeService.create(req.body);
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.put('/recipes/:id', (req, res) => {
  try {
    const updated = recipeService.update(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.delete('/recipes/:id', (req, res) => {
  try {
    recipeService.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

module.exports = router;
