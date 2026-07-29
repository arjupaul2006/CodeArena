const express = require("express");
const route = express.Router();
const problemsController = require("../controllers/problemsController");

route.get("/problems", problemsController.getAllProblems);
route.get("/problems/:id", problemsController.getProblemById);

module.exports = route;