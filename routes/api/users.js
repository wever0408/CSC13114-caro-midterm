const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation

  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          //id: user.id,
          name: user.name,
          email: user.email
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

// @route POST user/update
// @desc Update user info
// @access Public
router.post("/update", (req, res, next) => {
  passport.authenticate(
    "jwt",
    {
      session: false
    },
    async (err, user, info) => {
      if (err || !user) {
        return res.json({
          returnCode: -1,
          message: "JWT không hợp lệ."
        });
      }

      //let avatar = req.body.avatar;
      const { email, name } = req.body;
      //const newAvatarFile = req.files[0];

      // if (newAvatarFile) {
      //     try {
      //         avatar = await Firebase.UploadImageToStorage(newAvatarFile);
      //     } catch (e) {
      //         console.error(e);
      //         avatar = req.body.avatar;
      //     }
      // }

      User.findOneAndUpdate(
        { email: email },
        { $set: { name: name } },
        { new: true },
        (err, doc) => {
          if (err) {
            res.json({
              returnCode: 0,
              message: "Hệ thống có lỗi, vui lòng thử lại sau."
            });
          } else {
            console.log(doc);
            res.json({
              returnCode: 1,
              message: "Cập nhật thành công.",
              doc
            });
          }
        }
      );
    }
  )(req, res, next);
});

// @route POST user/password
// @desc Change user password
// @access Public
router.post("/password", (req, res, next) => {
  passport.authenticate(
    "jwt",
    {
      session: false
    },
    async (err, user, info) => {
      if (err || !user) {
        return res.json({
          returnCode: -1,
          message: "JWT không hợp lệ."
        });
      }

      const { email, password } = req.body;
      const hash = bcrypt.hashSync(password, 10);

      User.findOneAndUpdate(
        { email: email },
        { $set: { password: hash } },
        { new: true },
        (err, doc) => {
          if (err) {
            res.json({
              returnCode: 0,
              message: "Hệ thống có lỗi, vui lòng thử lại sau."
            });
          } else {
            console.log(doc);
            res.json({
              returnCode: 1,
              message: "Đổi mật khẩu thành công.",
              doc
            });
          }
        }
      );
    }
  )(req, res, next);
});

module.exports = router;
