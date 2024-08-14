const express = require("express");
const { authenticated, notAuthenticated } = require("../middlewares/auth");
const { userValidationRules, userAuthenticationValidationRules, validate } = require("../middlewares/validator");
const authController = require("../controllers/auth");

const router = express.Router();

router.post("/signup", [notAuthenticated, userValidationRules(), validate()], authController.signUp);

router.post("/login", [notAuthenticated, userAuthenticationValidationRules(), validate()], authController.login);

router.get("/status", authenticated, authController.status);

module.exports = router;
