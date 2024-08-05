const express = require("express");
const Pin = require("../models/pin");
const multer  = require('multer');
const sizeOf = require('image-size')
const fs = require('fs')
const { authenticated } = require('../middlewares/auth');
const Like = require("../models/like");
const Comment = require('../models/comment')
const path = require('path')

const router = express.Router();

const storage = multer.diskStorage({
  destination: 'public/pins/',
  filename: function (req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase()
      cb(null, `${Date.now() + Math.random().toFixed(5).slice(2)}.${ext}`)
  }
});

const upload = multer({
  limits: { fileSize: 1024 * 1024 * 100 },
  storage: storage ,
  fileFilter: (req, file, cb) => {
      let fileTypes = /jpeg|jpg|png/;
      let mimeType = fileTypes.test(file.mimetype);
      if (mimeType)  return cb(null, true);
      cb(new Error('It is not allowed to upload this file'));
  },
});

router.get("/", async function (req, res) {
  try {
    // const {limit, page, sort, where} = req.query
    const {limit, page, sort, q} = req.query
    const where = q ? {user: q} : {}
    const pins = await Pin.paginate({limit, page, sort, where})
    return res.status(200).json(pins)
  }
  catch (err) {
    return res.status(400).json(err)
  }
});

// router.post("/", async function (req, res) {
//   try {
//     const {excludeIds} = req.body
//     const pins = await Pin.getRandomSample({excludeIds})
//     return res.status(200).json(pins)
//   }
//   catch (err) {
//     return res.status(400).json(err)
//   }
// });

router.post("/create", [authenticated, upload.single('pin')], async function (req, res) {
  try {
    const { title, description } = req.body
    const { _id: user } = req.user
    const { filename: name, path } = req.file
    const {width, height} = sizeOf(path)
  
    const pin = new Pin({title, description, name, user, width, height})
    await pin.save()
  
    return res.status(201).json({pin})
  }
  catch (err) {
    return res.status(400).json(err)
  }
});

router.post('/update', authenticated, async function (req, res) {
  try {
    const { title, description, pin_id } = req.body
  
    const pin = await Pin.findById(pin_id).populate('user', '-password')
    pin.title = title
    pin.description = description
    await pin.save()
  
    return res.status(201).json({pin})
  }
  catch (err) {
    return res.status(400).json(err)
  }
})

router.post('/delete', authenticated, async function (req, res) {
  try {
    const { pin_id } = req.body
    const pin = await Pin.findByIdAndDelete(pin_id)
    await Like.deleteMany({pin_id})
    await Comment.deleteMany({pin_id})
    fs.unlink("public/pins/" + pin.name, (err) => {
      if (err) {
        console.error(`Error removing file: ${err}`);
        return;
      }
      // console.log(`File has been successfully removed.`);
    });
    return res.status(200).send('deleted')
  }
  catch (err) {
    return res.status(400).json(err)
  }
})

router.post('/a', authenticated, async function (req, res) {
  async function sleep(ms) {
    return await new Promise((resolve) => {setTimeout(resolve, ms)});
  }
  try {
    const files = fs.readdirSync('public/pins');
    const pinPromises = files.map(async (file, index) => {
      await sleep(100 * index)
      const path = `public/pins/${file}`;
      const { width, height } = sizeOf(path);
      const pin = new Pin({
        title: `Title ${file}`,
        description: `Description ${file}`,
        width,
        height,
        name: file,
        user: req.user._id
      });
      await pin.save();
    });

    await Promise.all(pinPromises);
    res.status(201).send('good');
  } catch (err) {
    console.error('Error reading directory:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.get("/:pin_name", async function (req, res) {
  try {
    const { pin_name } = req.params
    const pin = await Pin.findOne({name: pin_name}).populate('user', '-password')
    let liked = false
    if(req.user){
      const {_id: user} = req.user
      liked = await Like.findOne({pin_id: pin._id, user}) ? true : false
    }
    return res.status(200).json({pin, liked})
  }
  catch (err) {
    return res.status(400).json(err)
  }
});


module.exports = router;
