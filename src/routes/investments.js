import express from "express";
import Investment from "../models/Investment.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Create investment
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, funds, netProfit, availableIncome, payouts } = req.body;
    const investment = new Investment({
      user: req.user.id,
      title,
      funds,
      netProfit,
      availableIncome,
      payouts
    });
    await investment.save();
    res.json(investment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get dashboard summary
router.get("/summary", authMiddleware, async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.user.id });
    const summary = {
      totalFunds: investments.reduce((a, b) => a + (b.funds || 0), 0),
      totalIncome: investments.reduce((a, b) => a + (b.netProfit || 0), 0),
      availableIncome: investments.reduce((a, b) => a + (b.availableIncome || 0), 0),
      payouts: investments.reduce((a, b) => a + (b.payouts || 0), 0)
    };
    res.json({ summary, investments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
