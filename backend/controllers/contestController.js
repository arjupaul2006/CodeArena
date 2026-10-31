const express = require("express");
const Contest = require("../model/contest");
const ContestTestCase = require("../model/contestTestCases");
const ContestProblem = require("../model/contestProblems");
const User = require("../model/user");
const {
  getContestLeaderboard,
  getGlobalLeaderboard,
} = require("../services/leaderboardService");
const Problem = require("../model/problems");
const ContestSubmission = require("../model/contestSubmissions");
const mongoose = require("mongoose");

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

module.exports.getContestProgress = async (req, res) => {
  try {
    const { contestId } = req.params;
    const contest = await Contest.findById(contestId).select("problems");

    if (!contest) {
      return res.status(404).json({
        message: "Contest not found",
      });
    }

    const problemIds = contest.problems.map((problemId) =>
      problemId.toString(),
    );
    const submissions = await ContestSubmission.find({
      userId: req.user._id,
      contestId,
      problemId: { $in: contest.problems },
    })
      .select("problemId status submittedAt")
      .sort({ submittedAt: -1 })
      .lean();

    const problemProgress = problemIds.map((problemId) => {
      const problemSubmissions = submissions.filter(
        (submission) => submission.problemId.toString() === problemId,
      );
      const acceptedSubmission = problemSubmissions.find(
        (submission) => submission.status === "Accepted",
      );

      return {
        problemId,
        solved: Boolean(acceptedSubmission),
        attempts: problemSubmissions.length,
        lastStatus: problemSubmissions[0]?.status || null,
        lastSubmittedAt: problemSubmissions[0]?.submittedAt || null,
      };
    });

    const solvedCount = problemProgress.filter(
      (problem) => problem.solved,
    ).length;
    const attempts = submissions.length;

    return res.json({
      success: true,
      progress: {
        solvedCount,
        totalProblems: problemIds.length,
        attempts,
        problems: problemProgress,
      },
    });
  } catch (error) {
    console.error("Error retrieving contest progress:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.getContestSubmissions = async (req, res) => {
  try {
    const { contestId } = req.params;

    if (!mongoose.isValidObjectId(contestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contest ID",
      });
    }

    const contest = await Contest.findById(contestId)
      .select("problems")
      .populate("problems", "title");

    if (!contest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found",
      });
    }

    const submissions = await ContestSubmission.find({
      contestId,
      userId: req.user._id,
    })
      .sort({ submittedAt: -1 })
      .lean();

    const problemTitles = new Map(
      contest.problems.map((problem) => [
        problem._id.toString(),
        problem.title || "Untitled problem",
      ]),
    );

    return res.json({
      success: true,
      submissions: submissions.map((submission) => ({
        id: submission._id,
        problemId: submission.problemId,
        code: submission.code,
        problemTitle:
          problemTitles.get(submission.problemId.toString()) ||
          "Untitled problem",
        language: submission.language,
        status: submission.status,
        runtime: submission.executionTime ?? 0,
        memory: submission.memoryUsed ?? 0,
        passedTestCases: submission.passedTestCases,
        totalTestCases: submission.totalTestCases,
        submittedAt: submission.submittedAt,
      })),
    });
  } catch (error) {
    console.error("Error retrieving contest submissions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve contest submissions",
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

module.exports.getContestLeaderboard = async (req, res) => {
  try {
    const leaderboard = await getContestLeaderboard(req.params.contestId);
    const userEntry = leaderboard.find(
      (entry) => String(entry.userId) === String(req.user._id),
    );

    return res.json({
      success: true,
      leaderboard,
      userRank: userEntry?.rank || null,
    });
  } catch (error) {
    console.error("Error retrieving contest leaderboard:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.getGlobalLeaderboard = async (req, res) => {
  try {
    const leaderboard = await getGlobalLeaderboard(req.user._id);
    const userEntry = leaderboard.find((entry) => entry.isUser);

    return res.json({
      success: true,
      leaderboard,
      userRank: userEntry?.rank || null,
    });
  } catch (error) {
    console.error("Error retrieving global leaderboard:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.submitContestProblem = async (req, res) => {
  try {
    const { contestId, problemId } = req.params;
    const {
      code,
      language,
      status,
      runtime,
      memory,
      passedTestCases,
      totalTestCases,
    } = req.body;
    const userId = req.user._id;

    // 1. Validate IDs
    if (
      !mongoose.isValidObjectId(contestId) ||
      !mongoose.isValidObjectId(problemId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid contest or problem ID",
      });
    }

    // 2. Validate submission data
    if (typeof code !== "string" || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Code cannot be empty",
      });
    }

    if (
      !Number.isInteger(passedTestCases) ||
      !Number.isInteger(totalTestCases) ||
      passedTestCases < 0 ||
      totalTestCases < 0 ||
      passedTestCases > totalTestCases
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid test case counts",
      });
    }

    const supportedLanguages = ["python", "cpp", "java", "javascript"];

    if (
      typeof language !== "string" ||
      !supportedLanguages.includes(language.toLowerCase())
    ) {
      return res.status(400).json({
        success: false,
        message: "Unsupported programming language",
      });
    }

    // 3. Find contest and problem
    const contest = await Contest.findById(contestId);

    if (!contest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found",
      });
    }

    // 4. Check whether the problem belongs to this contest
    const problemBelongsToContest = contest.problems.some(
      (item) => String(item._id || item) === String(problemId),
    );

    if (!problemBelongsToContest) {
      return res.status(400).json({
        success: false,
        message: "This problem does not belong to this contest",
      });
    }

    // 5. Check contest timing
    const now = new Date();

    if (now < new Date(contest.startTime)) {
      return res.status(403).json({
        success: false,
        message: "Contest has not started yet",
      });
    }

    if (now >= new Date(contest.endTime)) {
      return res.status(403).json({
        success: false,
        message: "Contest has ended",
      });
    }

    // 6. Check participant registration
    const isParticipant = contest.participants.some(
      (participant) => String(participant.user) === String(userId),
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You must register for this contest first",
      });
    }

    // 7. Save submission
    const contestSubmission = await ContestSubmission.create({
      userId,
      contestId,
      problemId,
      language: language.trim().toLowerCase(),
      code,
      status: status === "accepted" ? "Accepted" : "Wrong Answer",
      passedTestCases,
      totalTestCases,
      executionTime: runtime,
      memoryUsed: memory,
      submittedAt: new Date(),
    });

    const leaderboard = await getContestLeaderboard(contestId);
    const io = req.app.get("io");

    if (io) {
      io.to(`contest:${contestId}`).emit("contest:leaderboard:update", {
        contestId,
        leaderboard,
      });
    }

    // 8. Return response
    return res.status(201).json({
      success: true,
      message: "Submission received successfully",
      submission: contestSubmission,
    });
  } catch (error) {
    console.error("Error submitting contest problem:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit problem",
    });
  }
};
