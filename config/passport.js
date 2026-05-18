const passport       = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User           = require('../models/User');

passport.use(new GoogleStrategy(
  {
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  `${process.env.SERVER_URL || 'http://localhost:5000'}/api/auth/google/callback`
  },
  async (_accessToken, _refreshToken, profile, done) => {
    try {
      // Find or create the user
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        user = await User.create({
          googleId: profile.id,
          name:     profile.displayName,
          email:    profile.emails?.[0]?.value || '',
          avatar:   profile.photos?.[0]?.value  || ''
        });
      } else {
        // Keep avatar fresh in case Google updates it
        user.avatar = profile.photos?.[0]?.value || user.avatar;
        await user.save();
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// Store only the user _id in the session cookie
passport.serializeUser((user, done)   => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
