const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// adjust the path if your model location differs
const User = require('../models/User');

// =========================
// Test route
// GET /api/users/test
// =========================
router.get('/test', (req, res) => {
  res.json({ ok: true, message: 'Users route works 🚀' });
});

// =========================
// Register new user
// POST /api/users/register
// Body: { name, email, password, role }
// =========================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    await user.save();

    res.status(201).json({ success: true, message: 'User registered successfully', user });
  } catch (err) {
    console.error('Error in /register:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// =========================
// Login user
// POST /api/users/login
// Body: { email, password }
// =========================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'mysecret',
      { expiresIn: '1h' }
    );

    res.json({ success: true, token });
  }