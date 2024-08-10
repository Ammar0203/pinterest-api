const express = require("express")
const { authenticated } = require('../middlewares/auth')
const likeController = require('../controllers/like')

const router = express.Router()

router.post('/', authenticated, likeController.like)

router.get('/:pin_id', authenticated, likeController.getLike)

module.exports = router