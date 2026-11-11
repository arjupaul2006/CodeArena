const express = require("express");
const Problem = require("../model/problems");
const TestCase = require("../model/test_cases");
const User = require("../model/user");
const Submission = require("../model/submission");
const { getContestLeaderboard } = require("../services/leaderboardService");

module.exports.submitProblem = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    const { problemId } = req.body;

    if (!problemId || !userId) {
      return res.status(400).json({ error: "Missing problemId or userId" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { solvedProblems: problemId } },
      { returnDocument: "after" },
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "Problem submitted successfully", user });
  } catch (error) {
    console.error("Error submitting problem:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.addSubmissionHistory = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    const {
      contestId,
      problemId,
      code,
      language,
      status,
      runtime,
      memory,
    } = req.body;
    const submission = new Submission({
      contestId,
      userId,
      problemId,
      code,
      language,
      status,
      runtime,
      memory,
    });
    await submission.save();

    if (contestId) {
      const leaderboard = await getContestLeaderboard(contestId);
      const io = req.app.get("io");

      if (io) {
        io.to(`contest:${contestId}`).emit("contest:leaderboard:update", {
          contestId,
          leaderboard,
        });
      }
    }

    return res
      .status(200)
      .json({ message: "Submission history added successfully", submission });
  } catch (error) {
    console.error("Error adding submission history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.getSubmissionHistory = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    const submissions = await Submission.find({ userId })
      .populate("problemId")
      .sort({ submissionDate: -1 });
    return res
      .status(200)
      .json({
        message: "Submission history retrieved successfully",
        submissions,
      });
  } catch (error) {
    console.error("Error retrieving submission history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.getSubmissionHistoryForProfile = async (req, res) => {
  try {
    const searchUserId = req.body.searchUserId || null;
    const userId = searchUserId || req.user?._id || req.body.userId;
    const submissions = await Submission.find({ userId })
      .populate("problemId")
      .sort({ submissionDate: -1 });
    return res
      .status(200)
      .json({
        message: "Submission history retrieved successfully",
        submissions,
      });
  } catch (error) {
    console.error("Error retrieving submission history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.submissionHistoryByProblemId = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    const { problemId } = req.body;
    const submissions = await Submission.find({ userId, problemId })
      .populate("problemId")
      .sort({ submissionDate: -1 });
      
    return res
      .status(200)
      .json({
        message: "Submission history retrieved successfully",
        submissions,
      });
  } catch (error) {
    console.error("Error retrieving submission history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.getTotalSubmissionInEachDay = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;

    const submissions = await Submission.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$submissionDate" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const activeDates = submissions.map((submission) => submission._id);
    const activeDateSet = new Set(activeDates);
    let maxStreak = 0;
    let streak = 0;

    activeDates.forEach((date, index) => {
      if (index > 0) {
        const previousDate = new Date(`${activeDates[index - 1]}T00:00:00Z`);
        const currentDate = new Date(`${date}T00:00:00Z`);
        const dayDifference =
          (currentDate - previousDate) / (1000 * 60 * 60 * 24);

        streak = dayDifference === 1 ? streak + 1 : 1;
      } else {
        streak = 1;
      }

      maxStreak = Math.max(maxStreak, streak);
    });

    const today = new Date();
    const todayDate = today.toISOString().slice(0, 10);
    const yesterday = new Date(today);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const latestDate = activeDateSet.has(todayDate)
      ? todayDate
      : yesterday.toISOString().slice(0, 10);

    let currentStreak = 0;
    if (activeDateSet.has(latestDate)) {
      currentStreak = 1;
      let date = new Date(`${latestDate}T00:00:00Z`);

      while (true) {
        date.setUTCDate(date.getUTCDate() - 1);
        const previousDate = date.toISOString().slice(0, 10);

        if (!activeDateSet.has(previousDate)) {
          break;
        }

        currentStreak += 1;
      }
    }

    return res.status(200).json({
      message: "Total submissions in each day retrieved successfully",
      submissions,
      currentStreak,
      maxStreak,
    });

  } catch (error) {
    console.error("Error retrieving total submissions in each day:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
