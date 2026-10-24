const Contest = require("../model/contest");
const ContestSubmission = require("../model/contestSubmissions");


// Get the leaderboard for a specific contest
const getContestLeaderboard = async (contestId) => {
  const contest = await Contest.findById(contestId)
    .select("problems participants startTime")
    .populate("participants.user", "username");

  if (!contest) {
    const error = new Error("Contest not found");
    error.statusCode = 404;
    throw error;
  }

  const submissions = await ContestSubmission.find({
    contestId,
    problemId: { $in: contest.problems },
  })
    .sort({ submittedAt: 1 })
    .lean();

  const entries = new Map();

  for (const participant of contest.participants) {
    if (!participant.user) {
      continue;
    }

    entries.set(participant.user._id.toString(), {
      userId: participant.user._id,
      name: participant.user.username,
      score: 0,
      penalty: 0,
      solvedProblems: new Set(),
      wrongAttempts: new Map(),
    });
  }

  for (const submission of submissions) {
    const entry = entries.get(submission.userId.toString());
    const problemId = submission.problemId.toString();

    if (!entry || entry.solvedProblems.has(problemId)) {
      continue;
    }

    if (submission.status === "Accepted") {
      const wrongAttempts = entry.wrongAttempts.get(problemId) || 0;
      const solveMinutes = Math.max(
        0,
        Math.floor(
          (new Date(submission.submittedAt).getTime() -
            new Date(contest.startTime).getTime()) /
            60000,
        ),
      );

      entry.solvedProblems.add(problemId);
      entry.score += 100;
      entry.penalty += solveMinutes + wrongAttempts * 20;
    } else {
      entry.wrongAttempts.set(
        problemId,
        (entry.wrongAttempts.get(problemId) || 0) + 1,
      );
    }
  }

  return [...entries.values()]
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.penalty - right.penalty;
    })
    .map((entry, index) => ({
      rank: index + 1,
      userId: entry.userId,
      name: entry.name,
      avatar: entry.name?.slice(0, 2).toUpperCase() || "??",
      score: entry.score,
      penalty: entry.penalty,
      problemsSolved: Object.fromEntries(
        contest.problems.map((problemId, problemIndex) => [
          String.fromCharCode(65 + problemIndex),
          entry.solvedProblems.has(problemId.toString()),
        ]),
      ),
    }));
};

module.exports = { getContestLeaderboard };
