
// if using mongoose
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

app.get('/api/test-db', async (req, res) => {
  if (!MONGODB_URI) return res.status(500).json({ ok: false, error: 'No MONGODB_URI' });

  try {
    // connect, test, then disconnect (or keep connection open in real app)
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const admin = mongoose.connection.db.admin();
    const info = await admin.serverStatus();
    // optionally close if you don't maintain persistent connection
    // await mongoose.disconnect();
    res.json({ ok: true, msg: 'DB connected', version: info.version });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});
