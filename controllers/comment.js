const Comment = require('../models/comment')
const Pin = require('../models/pin')

exports.get = async function (req, res) {
  try {
    const { pin_id, page } = req.query
    // const comments = await Comment.paginate({page})
    const comments = await Comment.find({pin_id}).populate('user', '-password')
    return res.status(200).json({comments})
  }
  catch (err) {
    return res.status(400).json(err)
  }
}

exports.createOne = async function (req, res) {
  try {
    const { pin_id, content } = req.body
    const { _id: user } = req.user
    const comment = new Comment({user, pin_id, content})
    await comment.populate('user', '-password')
    await comment.save()
    await Pin.findByIdAndUpdate(pin_id, {$inc: {comments: 1}})
    return res.status(201).json({comment})
  }
  catch (err) {
    return res.status(400).json(err)
  }
}

exports.updateOne = async function (req, res) {
  try {
    const { pin_id, content } = req.body
    const { _id: user } = req.user
    const comment = await Comment.findOne({pin_id, user})
    comment.content = content
    await comment.save()
    return res.status(201).json({comment})
  }
  catch (err) {
    return res.status(400).json(err)
  }
}

exports.deleteOne = async function (req, res) {
  try {
    const { comment } = req.body
    const { _id: user } = req.user
    await Comment.deleteOne({user, pin_id: comment.pin_id})
    await Pin.updateOne({_id: comment.pin_id}, {$inc: {comments: -1}})
    return res.status(201).send('Comment is deleted')
  }
  catch (err) {
    return res.status(400).json(err)
  }
}