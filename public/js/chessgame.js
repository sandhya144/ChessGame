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
    board.forEach((row, rowindex) => {
        row.forEach((square, squareindex) => {
            const squareElement = document.createElement("div");
            squareElement.classList.add("square",
              (rowindex + squareindex) % 2 === 0 ? "light" : "dark"  
            );

            squareElement.dataset.row = rowindex;
            squareElement.dataset.col = squareindex;

            if(square){
                 const pieceElement = document.createElement("div");
                 pieceElement.classList.add("piece", 
                 square.color === 'w' ? "white" : "black"
                );

                pieceElement.innerText = getPieceUnicode(square);
                pieceElement.draggable = playerRole === square.color;

                pieceElement.addEventListener("dragstart", (e) => {
                    if(pieceElement.draggable ){
                        draggedPiece = pieceElement;
                        sourceSquare = {row: rowindex, col: squareindex};
                        e.dataTransfer.setData("text/plain","");
                    }
                });

                pieceElement.addEventListener("dragend", (e) => {
                    draggedPiece = null;
                    sourceSquare = null;
                })

                squareElement.appendChild(pieceElement);
            }

            squareElement.addEventListener("dragover", function(e){
                e.preventDefault();
            });

            squareElement.addEventListener("drop", function (e) {
                e.preventDefault();
                if(draggedPiece){
                 const targetSource = {
                    row : parseInt(squareElement.dataset.row),
                    col : parseInt(squareElement.dataset.col),
                 };
                 
                 handleMove(sourceSquare, targetSource);
                }
            }); 
            boardElement.appendChild(squareElement);   
          });
        });

    if(playerRole === 'b'){
        boardElement.classList.add("flipped");
    }
    else{
        boardElement.classList.remove("flipped"); 
    }
};
    


const handleMove = (source, target) => {
    const move = {
     from: `${String.fromCharCode(97+ source.col)}${8-source.row}`,
     to: `${String.fromCharCode(97+ target.col)}${8- target.row}`,
     promotion: 'q'
    }
    socket.emit("move",move);
};


const getPieceUnicode = (piece) => {
    const unicodePieces = {
        K: "♔",  // King
        Q: "♕",  // Queen
        R: "♖",  // Rook
        B: "♗",  // Bishop
        N: "♘",  // Knight
        P: "♙",  // Pawn
        k: "♚",  // King
        q: "♛",  // Queen
        r: "♜",  // Rook
        b: "♝",  // Bishop
        n: "♞",  // Knight
        p: "♟"   // Pawn
    };
    return unicodePieces[piece.type] || "";
};

socket.on("playerRole", function (role){
    console.log("Assigned role:", role); 
    playerRole = role;
    renderBoard();
});


socket.on("spectatorRole",function(){
    playerRole = null;
    renderBoard();
});

socket.on("boardState",function(fen){
    chess.load(fen);
    renderBoard();
});

socket.on("move",function(move){
    chess.move(move);
    renderBoard();
});

// Example: Set player role (this part depends on your socket logic)
// or 'b' - you probably receive this from the server

const roleText = document.getElementById("player-role");

if (playerRole === 'w') {
  roleText.textContent = "You are Player 1 (White)";
  roleText.classList.add("text-white");
} else {
  roleText.textContent = "You are Player 2 (Black)";
  roleText.classList.add("text-gray-300");
}


function updateRoleText() {
  const roleText = document.getElementById("player-role");
  if (playerRole === 'w') {
    roleText.textContent = "You are Player 1 (White)";
  } else {
    roleText.textContent = "You are Player 2 (Black)";
  }
}

function toggleRole() {
  playerRole = playerRole === 'w' ? 'b' : 'w';
  updateRoleText();
}

// Call once to initialize
updateRoleText();

renderBoard();
