const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("../config/keys");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

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
      console.log(opts);
      User.findOne({email: jwt_payload.email})
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
                       User.findOneAndUpdate({email: user2.email}, {googleID: profile.id})
                        return cb(null, user2);
                      } else {
                        const newUser = new User({
                          password: profile.id,
                          name: profile.displayName,
                          email: profile.emails[0].value,
                          googleID: profile.id,
                          facebookID:""
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
  passport.use(
    new FacebookStrategy(
      {
        clientID: "401421594131119",
        clientSecret: "306f93c1027526769ac25fe49c0da99c",
        callbackURL: "/auth/facebook/callback",
        profileFields: ["id", "displayName", "emails", "picture.type(large)"]
      },
      function(accessToken, refreshToken, profile, cb) {
        try {
          if (profile.id) {
            User.findOne({ facebookID: profile.id })
              .then(user => {
                if (!user) {
                  User.findOne({ email: profile.emails[0].value })
                    .then(user2 => {
                      if (user2) {
                        //update id mapping
                        //UserModel.updateGoogleID(user2.username, profile.id);
                       User.findOneAndUpdate({email: user2.email}, {facebookID: profile.id})
                        return cb(null, user2);
                      } else {
                        const newUser = new User({
                          password: profile.id,
                          name: profile.displayName,
                          email: profile.emails[0].value,
                          facebookID: profile.id,
                          googleID:""
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
