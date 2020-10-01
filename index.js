const express = require("express");
const socket = require("socket.io");

// App setup
const PORT = process.env.PORT || 3002;
const app = express();
const server = app.listen(PORT, function () {
  console.log("----- ChatMap -----");
  console.log(`listening at http://localhost:${PORT}`);
});

// Static files
app.use(express.static("public"));

// Socket setup
const io = socket(server);

const chats = {};

io.on("connection", function (socket) {
  console.log("Made socket connection");
  

  socket.on("retrieve", function(data) {
    console.log('Sending existing instance');
    io.emit("existing data", chats[data]);
  });

  socket.on("new chat", function(data) {
    var instance = data.instance;
    if (!(instance in chats)){
      chats[instance] = [];
      setTimeout(function () {
        removeInstance(instance);
      }, 864000);
    }
    chats[instance].push(data);
    io.emit("chat", data);
  });

  socket.on("del chat", function(data) {
    var instance = data[1];
    var id = data[0];
    for (var x in chats[instance]){
      if (chats[instance][x].id == id){
        delete chats[instance][x]
      }
    }
    io.emit("unchat", [id, instance]);
  });

  socket.on("update chat", function(data) {
    var instance = data[1];
    var id = data[0];
    for (var x in chats[instance]){
      if (chats[instance][x].id == id){
        chats[instance][x].content = data[2];
      }
    }
    io.emit("chat message", data);
  });

  

});
function removeInstance(id){
  delete chats[id];
  console.log("removed ID: " + id);
}