const express = require("express");
const route = express.Router();
const submitProblemController = require("../controllers/submitProblemController");
const { authUser } = require("../middleware/authUser");

route.post("/submit-problem", authUser, submitProblemController.submitProblem);

route.post('/submissionHistory', authUser, submitProblemController.addSubmissionHistory);
route.get('/submissionHistory', authUser, submitProblemController.getSubmissionHistory);

route.post('/submissionHistoryByProblemId', authUser, submitProblemController.submissionHistoryByProblemId);

route.get('/getSubmissionEachDay', authUser, submitProblemController.getTotalSubmissionInEachDay);

module.exports = route;