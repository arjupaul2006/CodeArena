const express = require("express");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const User = require("../model/user");
const { createUser } = require("../services/userServices");
const jwt = require("jsonwebtoken");
const userModel = require("../model/user");
const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");
const Contest = require("../model/contest");
const Submission = require("../model/submission");

module.exports.createNewUser = async (req, res, next) => {
  // error handling for express-validator is done in middleware
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({ errors: errors.array() });
  }

  const { username, fullName, email, password } = req.body;

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
    fullName,
    email,
    password: hashedPassword,
  });

  // generate auth token which contains user id
  const token = user.generateAuthToken();

  res.status(201).json({ user, token });
};

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
    const user = await userModel
      .findById(decoded._id)
      .populate("solvedProblems");

    res.status(200).json({ user });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.params.userId)
      .populate("solvedProblems")
      .populate("contestsParticipated")
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return res.status(500).json({ message: "Unable to fetch user" });
  }
};

module.exports.searchUsers = async (req, res) => {
  const query = req.query.q?.trim();

  if (!query || query.length < 2) {
    return res.status(200).json({ users: [] });
  }

  try {
    const users = await User.find({
      _id: { $ne: req.user._id },
      username: { $regex: query, $options: "i" },
    })
      .select("username profileImage role")
      .limit(8)
      .lean();

    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error searching users:", error);
    return res.status(500).json({ message: "Unable to search users" });
  }
};

module.exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?._id;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both password fields are required" });
    }
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = await userModel.hashPassword(newPassword);
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ message: "Unable to update password" });
  }
};

module.exports.updateProfile = async (req, res, next) => {
  const {
    username,
    role,
    email,
    fullName,
    profileImage,
    linkedin,
    github,
    gender,
    xLink,
    birthday,
    location,
    bio,
  } = req.body;
  const userId = req.user?._id;

  if (typeof username === "string" && /\s/.test(username)) {
    return res.status(400).json({ message: "Username cannot contain spaces" });
  }

  try {
    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        username,
        role,
        email,
        fullName,
        profileImage,
        linkedin,
        github,
        gender,
        xLink,
        birthday: birthday || null,
        location,
        bio,
      },
      { returnDocument: "after" },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Error updating profile" });
  }
};

module.exports.updateProfileImage = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({
        message: "Please select an image",
      });
    }

    // Upload image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "profile_images",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      Readable.from(req.file.buffer).pipe(stream);
    });

    // Update MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          profileImage: result.secure_url,
        },
      },
      {
        returnDocument: "after",
      },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Profile image updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Cloudinary upload failed:");
    console.error("Message:", error.message);
    console.error("HTTP Code:", error.http_code);
    console.error("Full Error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports.userLogout = async (req, res, next) => {
  res.status(200).json({ message: "User logged out successfully" });
};

module.exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    const { password } = req.body;

    if (!password) {
      return res
        .status(400)
        .json({ message: "Password is required to delete account" });
    }

    const isCurrentPasswordValid = await req.user.comparePassword(password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        // Delete user from database
        await userModel.findByIdAndDelete(userId).session(session);

        // Remove user from contests
        await Contest.updateMany(
          { participants: userId },
          { $pull: { participants: userId } },
          { session },
        );

        // Set userId to null in submissions
        await Submission.updateMany(
          { userId: userId },
          { $set: { userId: null } },
          { session },
        );

        // Delete profile image from cloudinary
        if (req.user.profileImage) {
          const publicId = req.user.profileImage.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`profile_images/${publicId}`);
        }
      });
    } catch (error) {
      console.error("Error during transaction:", error);
      return res.status(500).json({ message: "Unable to delete account" });
    } finally {
      await session.endSession();
    }

    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    return res.status(500).json({ message: "Unable to delete account" });
  }
};
