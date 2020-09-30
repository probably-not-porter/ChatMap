const express = require("express");
const socket = require("socket.io");

// App setup
const PORT = 5000;
const app = express();
const server = app.listen(PORT, function () {
  console.log("----- ChatMap -----");
  console.log(`listening at http://localhost:${PORT}`);
});

// Static files
app.use(express.static("public"));

// Socket setup
const io = socket(server);

const chats = [];

io.on("connection", function (socket) {
  console.log("Made socket connection");
  io.emit("existing data", chats);

  socket.on("new chat", function(data) {
    console.log(data);
    chats.push(data);
    io.emit("chat", data);
  });
});