const express = require("express");
const { validationResult } = require("express-validator");
const User = require("../model/user");
const {createUser} = require("../services/userServices");
const jwt = require("jsonwebtoken");
const userModel = require("../model/user");

module.exports.createNewUser = async (req, res, next) => {
    // error handling for express-validator is done in middleware
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  // if captain is already exits
  const isUserAlreadyExits = await User.findOne({ email });
  if (isUserAlreadyExits) {
    return res.status(400).json({ message: "User is already exits" });
  }

  //convert password to hashed password
  const hashedPassword = await User.hashPassword(password);

  // create a new user in database
  const user = await createUser({
    username,
    email,
    password: hashedPassword,
  });

  // generate auth token which contains user id
  const token = user.generateAuthToken();

  res.status(201).json({ user, token });
}

module.exports.userLogin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({ errors: errors.array() });
  }
  const { email, password } = req.body;

  // check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }

  // verify the password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // generate auth token
  const token = user.generateAuthToken();

  res.status(200).json({ user, token });
};

module.exports.validateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);

    res.status(200).json({ user });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
}