const express = require("express");
const socket = require("socket.io");
const http = require("http");
const {Chess} = require("chess.js");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socket(server);

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Server listening on ${PORT}`);
// });



const chess = new Chess();
let players = {};
let currentPlayer = "w";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req,res) => {
    res.render("index", {title: "ChessKnight"});
});

// uniquesocket.on("join", function(){
    //     // console.log("joined");
    //     io.emit("joined all"); // send an event to all clients that a player has joined

    // uniquesocket.on("disconnect", function(){
    //     console.log("disconnected");    // when a player disconnects
    // });

 io.on("connection", function (uniquesocket) {
  console.log("connected");

  if (!players.white) {
    players.white = uniquesocket.id;
    uniquesocket.emit("playerRole", "w");
    uniquesocket.emit("boardState", chess.fen());
  } else if (!players.black) {
    players.black = uniquesocket.id;
    uniquesocket.emit("playerRole", "b");
    uniquesocket.emit("boardState", chess.fen());
  } else {
    uniquesocket.emit("spectatorRole");
    uniquesocket.emit("boardState", chess.fen());
  }
   

  uniquesocket.on("disconnect", function () {
    console.log("disconnected");
    if (uniquesocket.id === players.white) {
      delete players.white;
    } else if (uniquesocket.id === players.black) {
      delete players.black;
    }
  });

  uniquesocket.on("move", (move) => {
    try {
      if (chess.turn() === "w" && uniquesocket.id !== players.white) return;
      if (chess.turn() === "b" && uniquesocket.id !== players.black) return;

      const result = chess.move(move);

      if (result) {
        currentPlayer = chess.turn();
        io.emit("move", move);
        io.emit("boardState", chess.fen());
      } else {
        console.log("Invalid Move");
        uniquesocket.emit("Invalid move", move);
      }
    } catch (err) {
      console.log(err);
      uniquesocket.emit("Invalid move", move);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(3000, function () {
  console.log("Server is running on port 3000");
});
