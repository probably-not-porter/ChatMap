const socket = io();
let loaded = false;

socket.on("chat", function (data) {
  console.log(data);
  renderChat(data);
});

socket.on("chat", function (data) {
  console.log(data);
  renderChat(data);
});

socket.on("existing data", function (data) {
  if (!loaded){
    loaded = true;
    console.log(data);
    for (x in data){
      renderChat(data[x]);
    }
  }
});

function newChat(data){
  socket.emit("new chat", data);
}
function renderChat(data){
  const newDiv = document.createElement("div"); 
  newDiv.className = 'chat';
  newDiv.style.left = data.xPos + "px";
  newDiv.style.top = data.yPos + "px";
  newDiv.innerHTML = data.name;
  document.body.appendChild(newDiv);
}
function createChat(event) {
  if(event.target !== event.currentTarget) return;
  newChat({
    xPos: event.clientX, 
    yPos: event.clientY,
    name: 'name test'
  });
}

$('#container').on('click', function(e) {
  if(e.target != this) return;
  createChat(e);
}).on('click', 'div', function(e) {
  console.log('descendent')
  e.stopPropagation();
});
