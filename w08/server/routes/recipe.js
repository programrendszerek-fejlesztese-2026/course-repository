const express = require('express');
const router = express.Router();
const recipeService = require('../services/recipeService');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');

router.get('/recipes', async (req, res) => {
  try {
    const recipes = await recipeService.findAll(req.query.category);
    res.status(200).json(recipes);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.get('/recipes/:id', async (req, res) => {
  try {
    const recipe = await recipeService.findById(req.params.id);
    res.status(200).json(recipe);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.post('/recipes', auth, role('admin'), async (req, res) => {
  try {
    // the authenticated user is available at req.user
    const payload = { ...req.body, ownerId: req.user.id };
    const newRecipe = await recipeService.create(payload);
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.put('/recipes/:id', auth, role('admin'), async (req, res) => {
  try {
    const updated = await recipeService.update(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.delete('/recipes/:id', auth, role('admin'), async (req, res) => {
  try {
    await recipeService.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

module.exports = router;
