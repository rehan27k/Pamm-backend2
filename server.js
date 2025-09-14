const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// Health route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Connect MongoDB
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Example API
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from your backend!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

