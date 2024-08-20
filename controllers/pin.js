const Like = require("../models/like");
const Comment = require('../models/comment')
const Pin = require("../models/pin");
const Image = require("../models/Image");
const LightImage = require("../models/lightImage");

exports.getOneLightImage = async function (req, res) {
  try {
    const { _id } = req.params
    const image = await LightImage.findOne({pin: _id})
    return res.status(200).json({image : image.toObject()})
  }
  catch (err) {
    return res.status(400).json(err)
  }
}

exports.getOneImage = async function (req, res) {
  try {
    const { _id } = req.params
    const image = await Image.findOne({pin: _id})
    return res.status(200).json({image : image.toObject()})
  }
  catch (err) {
    return res.status(400).json(err)
  }
}

exports.getOne = async function (req, res) {
  try {
    const { _id } = req.params
    const pin = await Pin.findById(_id).populate('user', '-password')
    let liked = false
    if(req.user){
      const {_id: user} = req.user
      console.log(user)
      liked = await Like.findOne({pin_id: pin._id, user}) ? true : false
    }
    return res.status(200).json({pin : {...(pin.toObject()), liked}})
  }
  catch (err) {
    return res.status(400).json(err)
  }
}

exports.get = async function (req, res) {
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
    const { title, description, image, lightImage, width, height } = req.body
    const { _id: user } = req.user

    const pin = new Pin({title, description, user, width, height})
    await pin.save()
    
    const pinImage = new Image({pin: pin._id, image, width, height})
    await pinImage.save()
    
    const pinLightImage = new LightImage({pin: pin._id, image: lightImage, width, height})
    await pinLightImage.save()
    
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
    return res.status(204).send('deleted')
  }
  catch (err) {
    return res.status(400).json(err)
  }
}