const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const auth = require('../middlewares/authMiddleware');

router.get('/users', (req, res) => {
  try {
    const users = userService.findAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.get('/users/:id', (req, res) => {
  try {
    const user = userService.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.post('/users', (req, res) => {
  try {
    const newUser = userService.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.put('/users/:id', (req, res) => {
  try {
    const updated = userService.update(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.delete('/users/:id', (req, res) => {
  try {
    userService.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// Change password: authenticated users can change their own password by providing currentPassword and newPassword
// Admins can change any user's password by providing newPassword only
router.post('/users/:id/change-password', auth, (req, res) => {
  try {
    const actor = req.user; // { id, username, role }
    const result = userService.changePassword(req.params.id, actor, req.body.currentPassword, req.body.newPassword);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

module.exports = router;
