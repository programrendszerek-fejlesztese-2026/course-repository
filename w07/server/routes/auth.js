const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const authService = require('../services/authService');

router.post('/auth/register', async (req, res) => {
  try {
    const newUser = await userService.create(req.body);
    // After registration, return a token as well
    const result = await authService.login({ email: newUser.email, password: req.body.password });
    res.status(201).json({ user: newUser, token: result.token });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

module.exports = router;
