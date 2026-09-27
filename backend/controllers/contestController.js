const express = require("express");
const Contest = require("../model/contest");
const ContestTestCase = require("../model/contestTestCases");
const ContestProblem = require("../model/contestProblems");
const User = require("../model/user");

module.exports.getAllContests = async (req, res) => {
  try {
    const contests = await Contest.find()
      .populate("problems")
      .sort({ startTime: 1 });

    res.json({
      success: true,
      contests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.getContestById = async (req, res) => {
  try {
    const contestId = req.params.contestId;
    const contest = await Contest.findById(contestId).populate("problems");

    if (!contest) {
      return res.status(404).json({
        message: "Contest not found",
      });
    }
    res.json({
      success: true,
      contest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.getContestProblemsById = async (req, res) => {
  try {
    const { contestId, problemId } = req.params;
    const contestProblem = await ContestProblem.findById(problemId);

    if (!contestProblem) {
      return res.status(404).json({
        message: "Contest problem not found",
      });
    }

    const testCaseData = await ContestTestCase.findOne({
      problemId: problemId,
    });

    res.json({
      success: true,
      contestProblem,
      testCaseData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.addNewParticipants = async (req, res) => {
  try {
    const contestId = req.params.contestId;
    const userId = req.user._id;
    const contest = await Contest.findById(contestId);

    if (!contest) {
      return res.status(404).json({
        message: "Contest not found",
      });
    }

    const isUserAlreadyParticipant = contest.participants.some(
      (participant) => participant.user.toString() === userId.toString(),
    );

    if (isUserAlreadyParticipant) {
      return res.status(400).json({
        message: "User is already a participant",
      });
    }

    contest.participants.push({
      user: userId,
    });
    await contest.save();

    res.json({
      success: true,
      message: "Participant added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.removeParticipants = async (req, res) => {
  try {
    const contestId = req.params.contestId;
    const userId = req.user._id;
    const contest = await Contest.findById(contestId);

    if (!contest) {
      return res.status(404).json({
        message: "Contest not found",
      });
    }

    contest.participants = contest.participants.filter(
      (participant) => participant.user.toString() !== userId.toString(),
    );
    await contest.save();

    res.json({
      success: true,
      message: "Participant removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.addContestInUserProfile = async (req, res) => {
  try {
    const contestId = req.params.contestId;
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const isContestAlreadyAdded = user.contestsParticipated.some(
      (contest) => contest.toString() === contestId,
    );

    if (isContestAlreadyAdded) {
      throw new Error("Contest is already added to user profile");
    }

    user.contestsParticipated.push(contestId);
    await user.save();

    return res.json({
      success: true,
      message: "Contest added to user profile successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.removeContestFromUserProfile = async (req, res) => {
  try {
    const contestId = req.params.contestId;
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.contestsParticipated = user.contestsParticipated.filter(
      (contest) => contest.toString() !== contestId,
    );
    await user.save();

    return res.json({
      success: true,
      message: "Contest removed from user profile successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
