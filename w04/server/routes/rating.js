const express = require('express');
const router = express.Router();
const ratingService = require('../services/ratingService');

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

router.post('/ratings', (req, res) => {
  try {
    const newRating = ratingService.create(req.body);
    res.status(201).json(newRating);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.put('/ratings/:id', (req, res) => {
  try {
    const updated = ratingService.update(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.delete('/ratings/:id', (req, res) => {
  try {
    ratingService.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

module.exports = router;
