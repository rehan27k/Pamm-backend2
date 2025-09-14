// server.js
const express = require("express");
const mongoose = require("mongoose");

const app = express();   // <--- THIS LINE creates "app"

// Middleware
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// MongoDB connection
const uri = process.env.MONGODB_URI;
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Example test route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from your backend!" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
