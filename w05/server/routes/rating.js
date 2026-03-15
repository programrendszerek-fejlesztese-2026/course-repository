const express = require('express');
const router = express.Router();
const ratingService = require('../services/ratingService');
const auth = require('../middlewares/authMiddleware');

router.get('/ratings', (req, res) => {
  try {
    const ratings = ratingService.findAll();
    res.status(200).json(ratings);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.get('/ratings/:id', (req, res) => {
  try {
    const rating = ratingService.findById(req.params.id);
    res.status(200).json(rating);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.post('/ratings', auth, (req, res) => {
  try {
    const payload = { ...req.body, userId: req.user.id };
    const newRating = ratingService.create(payload);
    res.status(201).json(newRating);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.put('/ratings/:id', auth, (req, res) => {
  try {
    const updated = ratingService.update(req.params.id, req.body, req.user);
    res.status(200).json(updated);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.delete('/ratings/:id', auth, (req, res) => {
  try {
    ratingService.delete(req.params.id, req.user);
    res.status(204).send();
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

module.exports = router;
