const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Users route is working!" });
});

// Add user
router.post("/", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const newUser = new User({ name, email, password, role });
    await newUser.save();
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;