const User = require("../models/user");

exports.signUp = async function (req, res) {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({email})
    if(userExists) {
      return res.status(400).json({email: {message: `Email is already in use`}})
    }
    const user = new User({ name, email, password });
    await user.save();
    return res.status(201).send({ user: user.signJwt() });
  } catch (err) {
    return res.status(400).json(err);
  }
}

exports.login = async function (req, res) {
  try {
    const {email, password} = req.body
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ email: {message: "The email you entered does not belong to any account."} });
    }
    const isPassword = await user.comparePassword(password)
    console.log(isPassword)
    if (!isPassword) {
      return res.status(400).json({ password: {message: "Incorrect password."} });
    }
    return res.status(200).json({user: user.signJwt() });
  }
  catch (err) {
    return res.status(400).json(err)
  }
}

exports.status = async (req, res) => {
  const user = req.user
  return res.status(200).json({user: user.toJSON()})
}