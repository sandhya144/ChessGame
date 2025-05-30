const express = require("express");
const socket = require("socket.io");
const http = require("http");
const {Chess} = require("chess.js");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();
let players = {};
let currentPlayer = "W";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req,res) => {
    res.render("index", {title: "ChessGame"});
});

 io.on("connection", function(uniquesocket){
    console.log("connected");

    // uniquesocket.on("join", function(){
    //     // console.log("joined");
    //     io.emit("joined all"); // send an event to all clients that a player has joined

    uniquesocket.on("disconnected", function(){
        console.log("disconnected");
    })

    });


server.listen(3000, function(){
    console.log("Server is running on port 3000");
});