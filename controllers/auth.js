const User = require("../models/user");

exports.signUp = async function (req, res) {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({email})
    if(userExists) {
      return res.status(400).json({errors: [{msg: "Email is already in use.", path: 'email'}]})
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
      return res.status(400).json({errors: [{msg: "The email you entered does not belong to any account.", path: 'email'}]})
    }
    const isPassword = await user.comparePassword(password)
    if (!isPassword) {
      return res.status(400).json({errors: [{msg: "Incorrect password.", path: 'password'}]})
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