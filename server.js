const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI not set. Exiting.');
  process.exit(1);
}

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error', err);
    process.exit(1);
  });

app.get('/', (req, res) => res.send('<h2>Backend is running 🚀</h2>'));
app.get('/api/hello', (req, res) => res.json({ message: 'Hello from your backend!' }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));