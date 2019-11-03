const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email", "openid"]
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
    session: false
  }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email
        //avatar: user.avatar,
      },
      "1612585"
    );

    let responseHTML =
      '<script>res = %value%; window.opener.postMessage(res, "*");window.close();</script>';
    responseHTML = responseHTML.replace(
      "%value%",
      JSON.stringify({
        returnCode: 1,
        token: token
      })
    );
    res.send(responseHTML);
  }
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "http://localhost:5000/login",
    session: false
  }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
        //avatar: user.avatar
      },
      "1612585"
    );

    let responseHTML =
      '<script>res = %value%; window.opener.postMessage(res, "*");window.close();</script>';
    responseHTML = responseHTML.replace(
      "%value%",
      JSON.stringify({
        returnCode: 1,
        token: token
      })
    );
    res.send(responseHTML);
  }
);

module.exports = router;
