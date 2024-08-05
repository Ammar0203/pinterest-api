const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const { notAuthenticated, authenticated } = require("../middlewares/auth");

const router = express.Router();

router.post("/signup", notAuthenticated, async function (req, res) {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({email})
    if(userExists) {
      return res.status(400).json({email: {message: `Email is already in use`}})
    }
    const user = new User({ name, email, password });
    await user.save();
    return res.status(201).send({ success: true });
    // req.login(user, loginErr => {
    //   if (loginErr) {
    //     return next(loginErr);
    //   }
    //   return res.send({ success : true, message : 'authentication succeeded', user: user.toJSON() });
    // });      
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.post(
  "/login",
  notAuthenticated,
  function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) {
        return next(err); // will generate a 500 error
      }
      // Generate a JSON response reflecting authentication status
      if(info) {
        return res.status(400).json(info)
      }
      // ***********************************************************************
      // "Note that when using a custom callback, it becomes the application's
      // responsibility to establish a session (by calling req.login()) and send
      // a response."
      // Source: http://passportjs.org/docs
      // ***********************************************************************
      req.login(user, loginErr => {
        if (loginErr) {
          return next(loginErr);
        }
        return res.send({ success : true, message : 'authentication succeeded', user: user.toJSON() });
      });      
    })(req, res, next);
  });

router.get("/logout", authenticated, async function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    return res.status(200).json({ message: "Logged out successfully" });
  });
});

router.get("/status", async function (req, res) {
  if (req.isAuthenticated()) {
    res.json({ loggedIn: true, user: req.user });
  } else {
    res.json({ loggedIn: false });
  }
});

module.exports = router;
