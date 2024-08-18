const User = require('../models/user')
const fs = require('fs')
const mime = require('mime-types')

exports.updateOne = async function (req, res) {
  try {
    const { name } = req.body
    const { _id } = req.user
    const newAvatar = req.file?.filename
    const user = await User.findById(_id)
    user.name = name ? name : user.name
    if(newAvatar) {
      const filePath = req.file.path;
      const mimeType = mime.lookup(req.file.originalname);
      const file = fs.readFileSync(filePath);
      const base64 = file.toString('base64');
      const base64String = `data:${mimeType};base64,${base64}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Failed to delete the file:', err);
        }
      });
      user.avatar = base64String
    }
    await user.save()
    return res.status(200).json({user: user.toJSON()})
  }
  catch (err) {
    return res.status(400).json(err)
  }
}

exports.updatePassword = async function (req, res) {
  try {
    const { password, newPassword } = req.body
    const { _id } = req.user
    const user = await User.findById(_id)
    if(!await user.comparePassword(password)) {
      return res.status(401).send('Password is incorrect')
    }
    user.password = newPassword
    await user.save()
    return res.status(200).send('New password has been set')
  }
  catch (err) {
    return res.status(400).json(err)
  }
}

exports.getOne = async function (req, res) {
  try {
    const {_id} = req.params
    const user = await User.findById(_id)
    if (!user) {
      return res.status(400).json({user: {message: 'User not found'}})
    }
    return res.status(200).json({user: user.toJSON()})
  }catch (err) {
    return res.status(400).json(err)
  }
}