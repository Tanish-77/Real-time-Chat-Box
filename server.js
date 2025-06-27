const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("."));

let rooms = [];

io.on("connection", (socket) => {
  socket.on("getRooms", () => {
    socket.emit("roomList", rooms);
  });

  socket.on("createRoom", (room) => {
    if (!rooms.includes(room)) {
      rooms.push(room);
      io.emit("roomList", rooms);
    }
  });

  socket.on("joinRoom", ({ username, room }) => {
    socket.join(room);
  });

  // ✅ Send to all users including sender
  socket.on("message", (data) => {
    io.in(data.room).emit("message", data);
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
