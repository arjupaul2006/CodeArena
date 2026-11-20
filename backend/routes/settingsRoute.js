const express = require("express");
const route = express.Router();
const settingsController = require("../controllers/settingsController");
const authMiddleware = require("../middleware/authUser");

route.get('/getAllSettings', authMiddleware.authUser, settingsController.getAllSettings);
route.post('/updateSettings', authMiddleware.authUser, settingsController.updateSettings);

module.exports = route;