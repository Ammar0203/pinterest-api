const express = require("express");
const { authenticated } = require('../middlewares/auth');
const { postValidationRules, updatePostValidationRules } = require("../middlewares/validator");
const { uploadPin } = require("../middlewares/upload");
const pinController = require("../controllers/pin");

const router = express.Router();

router.get("/", pinController.get);

router.post("/create", [authenticated, uploadPin(), postValidationRules()], pinController.createOne);

router.post('/update', [authenticated, updatePostValidationRules()], pinController.updateOne)

router.post('/delete', authenticated, pinController.deleteOne)

router.get("/:pin_name", pinController.getOne);

module.exports = router;
