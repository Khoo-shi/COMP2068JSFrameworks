const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../models/User');

module.exports = function configurePassport(passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email'
      },
      async function (email, password, done) {
        try {
          const user = await User.findOne({
            email: email.toLowerCase()
          });

          if (!user) {
            return done(null, false, {
              message: 'No account was found with that email.'
            });
          }

          if (!user.password) {
            return done(null, false, {
              message: 'Please sign in using GitHub.'
            });
          }

          const passwordMatches = await bcrypt.compare(
            password,
            user.password
          );

          if (!passwordMatches) {
            return done(null, false, {
              message: 'The password you entered is incorrect.'
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function (id, done) {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};