// External Module
const dotenv = require("dotenv"); // dotenv is used to manage environment variables i.e server port
dotenv.config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

// Internal Module
const codeExecutionRoute = require("./routes/codeExecutionRoute");
const problemsRoute = require("./routes/problemRoute");
const userRoute = require("./routes/userRoute");
const submitProblemRoute = require("./routes/submitProblem");
const contestRoute = require("./routes/contestRoute");
const settingsRoute = require("./routes/settingsRoute");

const app = express();

// import cors
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", codeExecutionRoute);
app.use("/api", problemsRoute);
app.use("/api", userRoute);
app.use("/api", submitProblemRoute);
app.use("/api", contestRoute);
app.use("/api/settings", settingsRoute);

app.use("/", (req, res, next) => {
  res.send("Hello World");
});

module.exports = app;
