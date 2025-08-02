const socket = io();  // ye hamare device ko server se connect karega

//  socket.emit("join");   // send an event from the frontend to the server to join the game

// socket.on("joined all", function(){
//     console.log("joined the game");
// });

const chess = new Chess();
const boardElement = document.querySelector(".chessboard");


let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const renderBoard = () => {
    const board = chess.board();
    boardElement.innerHTML = "";
    board.forEach((row,rowindex) => {
        row.forEach((q, columnindex) => {})
    });
};
const handleMove = () => {};
const getPieceUnicode = () => {};

renderBoard();

