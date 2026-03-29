const express = require('express');
const router = express.Router();
const ratingService = require('../services/ratingService');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');

router.get('/ratings', async (req, res) => {
  try {
    const ratings = await ratingService.findAll();
    res.status(200).json(ratings);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.get('/ratings/:id', async (req, res) => {
  try {
    const rating = await ratingService.findById(req.params.id);
    res.status(200).json(rating);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.post('/ratings', auth, role('user'), async (req, res) => {
  try {
    const payload = { ...req.body, userId: req.user.id };
    const newRating = await ratingService.create(payload);
    res.status(201).json(newRating);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.put('/ratings/:id', auth, async (req, res) => {
  try {
    const updated = await ratingService.update(req.params.id, req.body, req.user);
    res.status(200).json(updated);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.delete('/ratings/:id', auth, async (req, res) => {
  try {
    await ratingService.delete(req.params.id, req.user);
    res.status(204).send();
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

module.exports = router;
