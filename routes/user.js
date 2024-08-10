const express = require('express')
const { authenticated } = require('../middlewares/auth');
const { updateUserValidationRules, updateUserPasswordValidationRules } = require('../middlewares/validator');
const { uploadAvatar } = require('../middlewares/upload');
const userController = require('../controllers/user');

const router = express.Router()

router.post('/update', [authenticated, uploadAvatar(), updateUserValidationRules()], userController.updateOne)

router.post('/password', [authenticated, updateUserPasswordValidationRules()], userController.updatePassword)

router.get('/:_id', userController.getOne)

module.exports = router