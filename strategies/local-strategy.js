const passport = require("passport");
const Strategy = require("passport-local");
const User = require("../models/user");

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser(async (_id, done) => {
  try {
    const user = await User.findById(_id).select("-password");
    if (!user)
      throw {
        message: "The email you entered does not belong to any account.",
      };
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new Strategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, { email: {message: "Incorrect email."} });
      }
      if (!(await user.comparePassword(password))) {
        return done(null, false, { password: {message: "Incorrect password."} });
      }
      return done(null, user);
    }
    catch (err) {
      done(err, false)
    }
  })
);
