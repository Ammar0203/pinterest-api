const Like = require("../models/like");
const Comment = require('../models/comment')
const path = require('path');
const Pin = require("../models/pin");
const multer  = require('multer');
const sizeOf = require('image-size')
const fs = require('fs')

exports.get = async function (req, res) {
  try {
    const { pin_name } = req.params
    const pin = await Pin.findOne({name: pin_name}).populate('user', '-password')
    let liked = false
    if(req.user){
      const {_id: user} = req.user
      console.log(user)
      liked = await Like.findOne({pin_id: pin._id, user}) ? true : false
    }
    return res.status(200).json({pin, liked})
  }
  catch (err) {
    return res.status(400).json(err)
  }
}

exports.getOne = async function (req, res) {
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
}

exports.createOne = async function (req, res) {
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
}

exports.updateOne = async function (req, res) {
  try {
    const { title, description, pin_id } = req.body
  
    const pin = await Pin.findById(pin_id).populate('user', '-password')
    pin.title = title
    pin.description = description
    await pin.save()
  
    return res.status(200).json({pin})
  }
  catch (err) {
    return res.status(400).json(err)
  }
}

exports.deleteOne = async function (req, res) {
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
    return res.status(204).send('deleted')
  }
  catch (err) {
    return res.status(400).json(err)
  }
}