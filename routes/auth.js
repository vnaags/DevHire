const express  = require('express');
const passport  = require('passport');
const router    = express.Router();

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5000';

// ── Kick off Google OAuth ──────────────────────────────────────────────────
// GET /api/auth/google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// ── Google callback ────────────────────────────────────────────────────────
// GET /api/auth/google/callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${CLIENT_URL}?auth=fail` }),
  (req, res) => {
    // Successful auth — redirect back to the frontend with a success flag
    res.redirect(`${CLIENT_URL}?auth=success`);
  }
);

// ── Current user (called by frontend on load) ─────────────────────────────
// GET /api/auth/me
router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    const { _id, name, email, avatar, role } = req.user;
    return res.json({ loggedIn: true, user: { id: _id, name, email, avatar, role } });
  }
  res.json({ loggedIn: false });
});

// ── Logout ─────────────────────────────────────────────────────────────────
// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out' });
    });
  });
});

module.exports = router;
