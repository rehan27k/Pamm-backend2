const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// adjust the path if your model location differs
const User = require('../models/User');

// Test route: GET /api/users/test
router.get('/test', (req, res) => {
  res.json({ ok: true, message: 'Users route works' });
});

// Register: POST /api/users/register
// body: { name, email, password }
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password required' });
    }

    // check if user exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'User with that email already exists' });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role: role || 'user',
    });

    await user.save();

    // don't return password
    const userResp = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.status(201).json({ message: 'User created', user: userResp });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login: POST /api/users/login
// body: { email, password }
// returns JWT if JWT_SECRET present, otherwise returns basic success
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    if (process.env.JWT_SECRET) {
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.json({ message: 'Login successful', token, user: payload });
    } else {
      // JWT not configured: return basic user info (not recommended for prod)
      return res.json({ message: 'Login successful (no JWT configured)', user: payload });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// (Optional) Get all users — for quick testing only
// GET /api/users/
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '-password').limit(100);
    res.json({ users });
  } catch (err) {
    console.error('List users error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;