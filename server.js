// server.js (CommonJS - works on Render by default)
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Read env values
const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI;

// Debugging logs (temporary)
console.log('Starting server.js');
console.log('PORT from env:', PORT);
console.log('MONGO_URI present:', !!MONGO_URI);
if (MONGO_URI) {
  console.log('MONGO_URI length:', MONGO_URI.length);
}

// Validate MONGO_URI
if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not defined. Set it in Render environment variables and redeploy.');
  // Exit to avoid app running without DB (optional - you can choose to comment this)
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message || err);
    // exit so Render shows failure; remove if you want app to stay up
    process.exit(1);
  });

// Simple routes
app.get('/', (req, res) => {
  res.send('<!doctype html><html><body><h2>Backend is running 🚀</h2></body></html>');
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from your backend!' });
});

// Start server AFTER mongoose connection established
// Option 1: start immediately (we already exit on connection error above)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});