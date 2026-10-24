const express = require("express");
const route = express.Router();
const contestController = require("../controllers/contestController");
const { authUser } = require("../middleware/authUser");

route.get("/contests", contestController.getAllContests);
route.get("/contests/:contestId/progress", authUser, contestController.getContestProgress);
route.get("/contests/:contestId/leaderboard", authUser, contestController.getContestLeaderboard);
route.get("/contests/:contestId/submissions", authUser, contestController.getContestSubmissions);
route.get("/contests/:contestId", contestController.getContestById);
route.get("/contests/:contestId/problem/:problemId", contestController.getContestProblemsById);

route.post("/contests/:contestId/addParticipants", authUser, contestController.addNewParticipants);
route.post("/contests/:contestId/removeParticipants", authUser, contestController.removeParticipants);

route.post("/contests/:contestId/addContestToUserProfile", authUser, contestController.addContestInUserProfile);
route.post("/contests/:contestId/removeContestFromUserProfile", authUser, contestController.removeContestFromUserProfile);

// contest problem submission route
route.post("/contests/:contestId/:problemId/submit", authUser, contestController.submitContestProblem);



module.exports = route;