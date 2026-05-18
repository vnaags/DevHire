require('dotenv').config(); // Must be the FIRST line
const express      = require('express');
const mongoose     = require('mongoose');
const cors         = require('cors');
const session      = require('express-session');
const MongoStore   = require('connect-mongo');
const passport     = require('./config/passport');
require('dotenv').config();

const app = express();

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5000';

// ── CORS — must allow credentials for session cookie ──────────────────────
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json({ limit: '2mb' }));

// ── MongoDB ───────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => { console.error('❌ MongoDB error:', err.message); process.exit(1); });

// ── Session (stored in MongoDB) ───────────────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET || 'devhire_secret_change_me',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// ── Passport ──────────────────────────────────────────────────────────────
app.use(passport.initialize());
app.use(passport.session());

// ── Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',  require('./routes/auth'));
app.use('/api/jobs',  require('./routes/jobs'));
app.use('/api/match', require('./routes/match'));

// Serve frontend files
app.use(express.static('.'));

app.get('/api', (req, res) => res.json({
  status: 'DevHire API running 🚀',
  endpoints: {
    auth:        '/api/auth/google',
    me:          '/api/auth/me',
    logout:      'POST /api/auth/logout',
    jobs:        '/api/jobs',
    seed:        'POST /api/jobs/seed',
    resumeMatch: 'POST /api/match'
  }
}));

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, req, res, next) => res.status(500).json({ message: err.message }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔐 Google Auth  → http://localhost:${PORT}/api/auth/google`);
  console.log(`📡 Jobs API     → http://localhost:${PORT}/api/jobs`);
  console.log(`🤖 Resume Match → http://localhost:${PORT}/api/match`);
});
