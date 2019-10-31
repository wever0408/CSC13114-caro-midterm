const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("../config/keys");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = keys.secretOrKey;

  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
  passport.use(
    new GoogleStrategy(
      {
        clientID:
          "524078277234-2es1eicloqai5g0liv1vnk1sld2ueave.apps.googleusercontent.com",
        clientSecret: "-woIP07QSSQZNCdipxku88J6",
        callbackURL: "/auth/google/callback"
      },
      function(accessToken, refreshToken, profile, cb) {
        try {
          if (profile.id) {
            User.findOne({ googleID: profile.id })
              .then(user => {
                if (!user) {
                  User.findOne({ email: profile.emails[0].value })
                    .then(user2 => {
                      if (user2) {
                        //update id mapping
                        //UserModel.updateGoogleID(user2.username, profile.id);
                       User.findOneAndUpdate({"email":user2.email},{"googleID":profile.id})
                        return cb(null, user2);
                      } else {
                        const newUser = new User({
                          password: profile.id,
                          name: profile.displayName,
                          email: profile.emails[0].value,
                          googleID: profile.id,
                          facebookId
                          //newUser.avatar = profile.photos[0].value;
                        })
                          .save()
                          .then(() => {
                            return cb(null, newUser);
                          })
                          .catch(err => cb(err));
                      }
                    })
                    .catch(err => cb(err));
                } else {
                  return cb(null, user);
                }
              })
              .catch(err => cb(err));
          } else {
            return cb(null, false);
          }
        } catch (e) {
          console.error(e);
          return cb(e);
        }
      }
    )
  );
};
