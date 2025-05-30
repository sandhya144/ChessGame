const socket = io();  // ye hamare device ko server se connect karega

socket.emit("join");   // send an event from the frontend to the server to join the game

// socket.on("joined all", function(){
//     console.log("joined the game");
// });



