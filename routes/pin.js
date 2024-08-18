const express = require("express");
const { authenticated } = require('../middlewares/auth');
const { postValidationRules, updatePostValidationRules, validate } = require("../middlewares/validator");
const { uploadPin } = require("../middlewares/upload");
const pinController = require("../controllers/pin");
const { compress } = require("../middlewares/compress");

const router = express.Router();

router.get("/", pinController.get);

router.post("/create", [authenticated, uploadPin(), postValidationRules(), validate(), compress()], pinController.createOne);

router.post('/update', [authenticated, updatePostValidationRules(), validate()], pinController.updateOne)

router.post('/delete', authenticated, pinController.deleteOne)

router.get("/:_id", pinController.getOne);

module.exports = router;
