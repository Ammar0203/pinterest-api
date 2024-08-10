const express = require('express')
const { authenticated } = require('../middlewares/auth')
const { commentValidationRules } = require('../middlewares/validator')
const commentController = require("../controllers/comment")

const router = express.Router()

router.get('/', commentController.get)

router.post('/create', [authenticated, commentValidationRules()], commentController.createOne)

router.post('/update', [authenticated, commentValidationRules()], commentController.updateOne)

router.post('/delete', authenticated, commentController.deleteOne)

module.exports = router