const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const gameConfig = require("./gameConfig");
const gameControl = require("./gameControl");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
  },
});

app.use(cors()); // Enable CORS for all routes

let game = {
  gameOver: false,
  score2: 0,
  score1: 0,
  paddle1: gameConfig.canvas.height / 2 - gameConfig.paddle.length / 2,
  paddle2: gameConfig.canvas.height / 2 - gameConfig.paddle.length / 2,
  ball: {
    x: gameConfig.canvas.width / 2,
    y: gameConfig.canvas.height / 2,
    hits: 0,
  },
};

let myGameControl = new gameControl(game);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("paddle", (id, step) => {
    myGameControl.movePaddle(id, step);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const emitGame = () => {
  myGameControl.routine();
  io.emit("game", myGameControl.getGame());

  setTimeout(emitGame, 10);
};

emitGame();




server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// const serverIP = "10.11.7.3";
// const serverPort = 3000;
// server.listen(serverPort, serverIP, () => {
//   console.log(`Server is running on http://${serverIP}:${serverPort}`);
// });
