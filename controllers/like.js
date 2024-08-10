const Like = require("../models/like")
const Pin = require("../models/pin")

exports.like = async function (req, res) {
  try{ 
    const { _id: user } = req.user
    const { pin_id } = req.body
    if(await Like.findOneAndDelete({user, pin_id})) {
      await Pin.updateOne({_id: pin_id}, {$inc: {likes: -1}})
      return res.status(200).send({liked: false})
    }
    const like = new Like({user, pin_id})
    await like.save()
    await Pin.updateOne({_id: pin_id}, {$inc: {likes: 1}})
    return res.status(200).send({liked: true})
  }
  catch (err) {
    return res.status(400).json(err)
  }
}

exports.getLike = async function (req, res) {
  try {
    const { _id: user } = req.user
    const { pin_id } = req.params
    if(await Like.findOne({user, pin_id})) {
      return res.status(200).json({liked: true})
    }
    return res.status(200).json({liked: false})
  }
  catch(err) {
    return res.status(400).json(err)
  }
}