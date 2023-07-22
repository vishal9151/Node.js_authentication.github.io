const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

passport.use(
    new googleStrategy(
      {
        clientID: "Please add your respective client id";
        clientSecret: "Please add your respective client secret",
        callbackURL: "http://localhost:8500/auth/google/callback",
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          // find a user
          const user = await User.findOne({ email: profile.emails[0].value }).exec();
  
          console.log(accessToken, refreshToken);
          console.log(profile);
  
          if (user) {
            // if found, set this user as req.user
            return done(null, user);
          } else {
            // if not found, create the user and set it as req.user
            const newUser = await User.create({
              username: profile.displayName,
              email: profile.emails[0].value,
              password: crypto.randomBytes(20).toString("hex"),
            });
  
            return done(null, newUser);
          }
        } catch (err) {
          console.log("error in google strategy-passport", err);
          return done(err);
        }
      }
    )
  );
  
         


module.exports = passport;
