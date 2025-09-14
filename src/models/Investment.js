import mongoose from "mongoose";

const investmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: String,
    funds: { type: Number, default: 0 },
    netProfit: { type: Number, default: 0 },
    availableIncome: { type: Number, default: 0 },
    payouts: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Investment", investmentSchema);
