const { body, validationResult, check } = require("express-validator");

const userValidationRules = () => {
  return [
    body("name").notEmpty().withMessage("Name can not be empty."),
    body("email").notEmpty().withMessage("Email can not be empty.").isEmail().withMessage('Email is invalid.'),
    body("password").notEmpty().withMessage("Password can not be empty.").isLength({ min: 5 }).withMessage("Password must be at least 5 characters."),
  ];
};

const userAuthenticationValidationRules = () => {
  return [
    body("email").notEmpty().withMessage("Email can not be empty.").isEmail().withMessage('Email is invalid.'),
    body("password").notEmpty().withMessage("Password can not be empty.").isLength({ min: 5 }).withMessage("Password must be at least 5 characters."),
  ];
};

const updateUserValidationRules = () => {
  return [
    body("name").notEmpty().withMessage("Name can not be empty.")
  ];
};

const updateUserPasswordValidationRules = () => {
  return [
    body("newPassword").notEmpty().withMessage("New password can not be empty.").isLength({ min: 5 }).withMessage("New password must be at least 5 characters."),
    body("password").notEmpty().withMessage("Password can not be empty.").isLength({ min: 5 }).withMessage("Password must be at least 5 characters."),
  ]
}

const postValidationRules = () => {
  return [
    body("title").notEmpty().withMessage("Title can not be empty."),
    body("description").notEmpty().withMessage("Description can not be empty."),
    // body("pin").notEmpty().withMessage("Pin can not be empty."),
    check("pin").custom((value, {req}) => {
      const fileTypes = /jpeg|jpg|png/;
      const mimeType = fileTypes.test(req.file.mimetype);
      return mimeType
    }).withMessage("Please add a pin.")
  ];
};

const updatePostValidationRules = () => {
  return [
    body("title").notEmpty().withMessage("Title can not be empty."),
    body("description").notEmpty().withMessage("Description can not be empty."),
  ];
};

const commentValidationRules = () => {
  return [
    body("content").notEmpty().withMessage("Comment can not be empty.")
  ]
}

const validate = () => (req, res, next) => {
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
