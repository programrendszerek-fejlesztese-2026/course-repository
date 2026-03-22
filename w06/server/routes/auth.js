const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const authService = require('../services/authService');

router.post('/auth/register', (req, res) => {
  try {
    const newUser = userService.create(req.body);
    // After registration, return a token as well
    const result = authService.login({ email: newUser.email, password: req.body.password });
    res.status(201).json({ user: newUser, token: result.token });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.post('/auth/login', (req, res) => {
  try {
    const result = authService.login(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

module.exports = router;
