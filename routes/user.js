const express = require('express')
const { authenticated } = require('../middlewares/auth');
const User = require('../models/user')
const multer = require('multer');
const fs = require('fs')
const path = require('path')

const router = express.Router()

const storage = multer.diskStorage({
  destination: 'public/avatars/',
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${Date.now() + Math.random().toFixed(5).slice(2)}.${ext}`)
  }
});

const upload = multer({
  limits: { fileSize: 1024 * 1024 * 10 },
  storage: storage ,
  fileFilter: (req, file, cb) => {
      let fileTypes = /jpeg|jpg|png/;
      let mimeType = fileTypes.test(file.mimetype);
      if (mimeType)  return cb(null, true);
      cb(new Error('It is not allowed to upload this file'));
  },
});

router.post('/update', [authenticated, upload.single('avatar')], async function (req, res) {
  try {
    const { name } = req.body
    const { _id } = req.user
    const oldAvatar = req.user.avatar
    const avatar = req.file?.filename
    const user = await User.findById(_id)
    user.name = name ? name : user.name
    if(avatar) {
      fs.unlink("public/avatars/" + oldAvatar, (err) => {
        if (err) {
          console.error(`Error removing file: ${err}`);
          return;
        }
        // console.log(`File has been successfully removed.`);
      });
    }
    user.avatar = avatar ? avatar : user.avatar
    await user.save()
    return res.status(200).json({user: user.toJSON()})
  }
  catch (err) {
    return res.status(400).json(err)
  }
})

router.post('/password', authenticated, async function (req, res) {
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
})

router.get('/:_id', async function (req, res) {
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
})

module.exports = router