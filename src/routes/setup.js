import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

// One-time admin creation
router.post("/admin", async (req, res) => {
  try {
    const { secret, email, password, name } = req.body;
    if (secret !== process.env.ADMIN_PASSWORD)
      return res.status(403).json({ message: "Forbidden" });

    const existing = await User.findOne({ email });
    if (existing) return res.json({ message: "Admin exists" });

    const hash = await bcrypt.hash(password, 10);
    const admin = new User({ name, email, password: hash, role: "admin" });
    await admin.save();

    res.json({ message: "Admin created", admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
