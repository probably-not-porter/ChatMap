const socket = io();
var loaded = false;
var instance = null;



socket.on("chat", function (data) { // recieve chat from server
  if (data.instance == instance){
    renderChat(data);
  }
});

socket.on("existing data", function (data) { // receive existing data for instance
  if (!loaded){
    loaded = true;
    for (x in data){
      renderChat(data[x]);
    }
  }
});

function switchInstance(n){ // switch to instance of chat
  loaded = false;
  clearContainer();
  instance = n;
  document.getElementById("room").innerHTML = "Room " + instance;
  socket.emit("retrieve", instance);
}

function clearContainer(){
  document.getElementById("container").innerHTML = "";
}

function newChat(data){
  socket.emit("new chat", data);
}
function renderChat(data){
  const newDiv = document.createElement("div"); 
  newDiv.className = 'chat';
  newDiv.style.left = data.xPos + "px";
  newDiv.style.top = data.yPos + "px";
  newDiv.innerHTML = data.name;
  document.getElementById("container").appendChild(newDiv);
}
function createChat(event) {
  if(event.target !== event.currentTarget) return;
  if(instance == null) return;
  newChat({
    instance: instance,
    xPos: event.clientX, 
    yPos: event.clientY,
    name: 'name test'
  });
}

function makeid() {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < 12; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

$('#container').on('click', function(e) {
  if(e.target != this) return;
  createChat(e);
}).on('click', 'div', function(e) {
  e.stopPropagation();
});

$('#create-btn').on('click', function(e) {
  switchInstance(makeid())
});
$('#join-btn').on('click', function(e) {
  var id = prompt("Enter Room ID", "12 char ID");
  switchInstance(id);
});
