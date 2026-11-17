const express = require("express");
const route = express.Router();
const submitProblemController = require("../controllers/submitProblemController");
const { authUser } = require("../middleware/authUser");

route.post("/submit-problem", authUser, submitProblemController.submitProblem);

route.post('/submissionHistory', authUser, submitProblemController.addSubmissionHistory);
route.get('/submissionHistory', authUser, submitProblemController.getSubmissionHistory);
route.post('/submissionHistoryForProfile', authUser, submitProblemController.getSubmissionHistoryForProfile);

route.post('/submissionHistoryByProblemId', authUser, submitProblemController.submissionHistoryByProblemId);
route.post('/submissionHistoryById', authUser, submitProblemController.getSubmissionById);

route.get('/getSubmissionEachDay', authUser, submitProblemController.getTotalSubmissionInEachDay);

module.exports = route;