const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const gameConfig = require("./gameConfig");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200", // Replace with the URL of your Angular app
    methods: ["GET", "POST"],
  },
});
const gameControl = require("./gameControl");

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

console.log("game");
console.log(game);
let myGameControl = new gameControl(game);

// WebSocket connection for chat
io.on("connection", (socket) => {
  console.log("A user connected");

  // Emit 'game' every 5 seconds
  const emitGame = () => {
    myGameControl.routine();
    io.emit("game", myGameControl.getGame());
    console.log("game emitted");

    // Schedule the next emit after 5 seconds
    setTimeout(emitGame, 5000);
  };

  // Initial call to start the periodic emitting
  emitGame();

  // Add a listener for the 'paddle' event
  socket.on("paddle", (id, step) => {
    console.log(`Received 'paddle' event with id: ${id}, step: ${step}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
