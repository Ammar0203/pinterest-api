const express = require('express')
const { authenticated } = require('../middlewares/auth');
const { updateUserValidationRules, updateUserPasswordValidationRules, validate } = require('../middlewares/validator');
const { uploadAvatar } = require('../middlewares/upload');
const userController = require('../controllers/user');

const router = express.Router()

router.post('/update', [authenticated, uploadAvatar(), updateUserValidationRules(), validate()], userController.updateOne)

router.post('/password', [authenticated, updateUserPasswordValidationRules(), validate()], userController.updatePassword)

router.get('/:_id', userController.getOne)

module.exports = router