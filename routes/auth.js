const express = require("express");
const { authenticated, notAuthenticated } = require("../middlewares/auth");
const { userValidationRules, userAuthenticationValidationRules } = require("../middlewares/validator");
const authController = require("../controllers/auth");

const router = express.Router();

router.post("/signup", [notAuthenticated, userValidationRules()], authController.signUp);

router.post("/login", [notAuthenticated, userAuthenticationValidationRules()], authController.login);

router.get("/status", authenticated, authController.status);

module.exports = router;
