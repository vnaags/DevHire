const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL || 'https://devhire-jdmi.onrender.com'}/api/auth/google/callback`
    },

    async (_accessToken, _refreshToken, profile, done) => {
      try {

        let user = await User.findOne({
          $or: [
            { googleId: profile.id },
            { email: profile.emails?.[0]?.value }
          ]
        });

        if (!user) {

          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value || '',
            avatar: profile.photos?.[0]?.value || ''
          });

        } else {

          // Attach googleId if missing
          if (!user.googleId) {
            user.googleId = profile.id;
          }

          // Update avatar
          user.avatar = profile.photos?.[0]?.value || user.avatar;

          await user.save();
        }

        return done(null, user);

      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Store only user id in session
passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;