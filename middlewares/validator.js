const { body, validationResult } = require("express-validator");

const userValidationRules = () => {
  return [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").notEmpty().withMessage("Email is required"),
    body("email").isEmail().withMessage('Email is invalid'),
    body("password").notEmpty().withMessage("Password is required"),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters"),
  ];
};

const userAuthenticationValidationRules = () => {
  return [
    body("email").notEmpty().withMessage("Email is required"),
    body("email").isEmail().withMessage('Email is invalid'),
    body("password").notEmpty().withMessage("Password is required"),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters"),
  ];
};

const updateUserValidationRules = () => {
  return [
    body("name").notEmpty().withMessage("Name is required")
  ];
};

const updateUserPasswordValidationRules = () => {
  return [
    body("password").notEmpty().withMessage("Password is required"),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters"),
  ]
}

const postValidationRules = () => {
  return [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("pin").notEmpty().withMessage("Pin is required"),
  ];
};

const updatePostValidationRules = () => {
  return [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
  ];
};

const commentValidationRules = () => {
  return [
    body("content").notEmpty().withMessage("Comment is required")
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({ errors: errors.array() });
};

module.exports = {
  userValidationRules,
  userAuthenticationValidationRules,
  updateUserValidationRules,
  updateUserPasswordValidationRules,
  postValidationRules,
  updatePostValidationRules,
  commentValidationRules,
  validate,
};
