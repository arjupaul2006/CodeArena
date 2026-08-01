const express = require("express");
const route = express.Router();
const {body , validationResult} = require("express-validator");
const userController = require('../controllers/userSigninController')

route.post('/signin', 
    // Express Validator (All Errors for these fields)
  [
    body("username")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),

    body("email")
      .isEmail()
      .withMessage("Please provide a valid email address")
      .isLength({ min: 5 })
      .withMessage("Email must be at least 5 characters long"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  userController.createNewUser
)

route.post('/login',
  [
    body("email")
      .isEmail()
      .withMessage("Please provide a valid email address")
      .isLength({ min: 5 })
      .withMessage("Email must be at least 5 characters long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  userController.userLogin
)

route.post('/validate-token', userController.validateToken)

module.exports = route