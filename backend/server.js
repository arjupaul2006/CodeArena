// Core Module
const http = require('http')
const { Server } = require("socket.io");

// Internal Module
const app = require('./app')
const port = process.env.PORT

// External Modules
const { default: mongoose } = require('mongoose');

// mongoDB connection string
const DB_PATH =
  process.env.MONGODB_URI;

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("contest:join", (contestId) => {
    socket.join(`contest:${contestId}`);
  });

  socket.on("contest:leave", (contestId) => {
    socket.leave(`contest:${contestId}`);
  });
});

app.set("io", io);

mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("Connected to Mongoose")
    server.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("Error while connecting to Mongoose: ", err);
  });