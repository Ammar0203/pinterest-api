const express = require('express')
const { authenticated } = require('../middlewares/auth')
const { commentValidationRules, validate } = require('../middlewares/validator')
const commentController = require("../controllers/comment")

const router = express.Router()

router.get('/', commentController.get)

router.post('/create', [authenticated, commentValidationRules(), validate()], commentController.createOne)

router.post('/update', [authenticated, commentValidationRules(), validate()], commentController.updateOne)

router.post('/delete', authenticated, commentController.deleteOne)

module.exports = router