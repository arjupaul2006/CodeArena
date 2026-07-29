const express = require("express");
const route = express.Router();
const problemsController = require("../controllers/problemsController");

route.get("/problems", problemsController.getAllProblems);

module.exports = route;