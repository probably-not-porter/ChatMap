$( document ).ready(function() {
  const socket = io();
  var loaded = false;
  var instance = null;

  if (window.location.search.length != 0){
    console.log('has room')
    const queryString = window.location.search;
    console.log(queryString);
    switchInstance(queryString.slice(1));
  }else{
    console.log('no room')
    document.getElementById("start-page").style.display = 'inline';
  }

  socket.on("chat", function (data) { // recieve chat from server
    if (data.instance == instance){
      renderChat(data);
    }
  });

  socket.on("unchat", function (data) {
    if (data[1] == instance){
      $("." + data[0]).remove();
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
  
  socket.on("chat message", function (data) {
    if (data[1] == instance){
      $("." + data[0] + " .chat-content").text(data[2]);
    }
  })


  function switchInstance(n){ // switch to instance of chat
    loaded = false;
    clearContainer();
    instance = n;
    document.getElementById('room-num').innerHTML = 'room ID: ' + n;
    socket.emit("retrieve", instance);
  }

  function clearContainer(){
    document.getElementById("container").innerHTML = "";
  }

  function newChat(data){
    socket.emit("new chat", data);
  }
  function renderChat(data){
    console.log(data);
    const newDiv = document.createElement("div"); 
    newDiv.className = 'chat ' + data.id;
    newDiv.id = data.id;
    newDiv.style.left = data.xPos + "px";
    newDiv.style.top = data.yPos + "px";
    newDiv.innerHTML = "<button>x</button>"; 
    newDiv.innerHTML += "<span class='data-id'>" + data.id + "</span>"; 
    newDiv.innerHTML += "<span class='chat-content'>" + data.content + "</span>";
    newDiv.innerHTML += data.name;
    document.getElementById("container").appendChild(newDiv);
  }
  function createChat(event) {
    if(event.target !== event.currentTarget) return;
    if(instance == null) return;
    var chat_id = makeid(10);
    newChat({
      instance: instance,
      xPos: event.clientX, 
      yPos: event.clientY,
      content: "(Click to edit)",
      name: document.getElementById('name-text').value,
      id: chat_id
    });
    return chat_id
  }

  function makeid(n) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < n; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  function removeChat(t){
    let id = $(t).parent('div').find('.data-id')[0].textContent;
    socket.emit("del chat", [id, instance]);
  }

  function editMessage(e){
    
    e.target.classList.add('edit-chat');
    console.log(e.target.classList);

    const inp = document.createElement("input");
    inp.className = 'chat-input';
    inp.addEventListener("input", function() {
      var id = e.target.parentElement.className.split(' ')[1];
      socket.emit("update chat", [id, instance, inp.value]);
    }); 
    
    document.getElementById("container").addEventListener("click", function() {
      inp.remove()
      e.target.classList.remove('edit-chat');
    });
    document.body.appendChild(inp);
    inp.focus()
  }

  $('.container').on('click', function(e) {
    let id = createChat(e);
  });
  $('.container').on('click', '.chat-content', function(e) {
    console.log('editing');
    editMessage(e);
  });
  $('.container').on('click', '.chat button', function(e) {
    removeChat(e.target);
  });
  $('#create-btn').on('click', function(e) {
    var new_instance_id = makeid(12);
    document.location.search = new_instance_id;
    const queryString = window.location.search;
    
  });
  function removeDiv(){
      $(this).parent('div').remove();
  }
});