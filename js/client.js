

const Client = {}
Client.socket = io.connect()

Client.makeNewRoom = function() {
  Client.socket.emit('newRoom')
}

Client.joinRoom = function() {
  Client.socket.emit('joinRoom')
}

Client.askNewPlayer = function(){
    Client.socket.emit('newplayer', Client.room.id);
};

Client.sendPosition = function(x,y){
  Client.socket.emit('move',{x:x,y:y, room: Client.room.id});
};

Client.hitConfirm = function(id) {
  Client.socket.emit('playerHit', {id:id, room: Client.room.id})
}

Client.increaseScore = function(id) {
  Client.socket.emit('increaseScore', id)
}

Client.itLeft = function() {
  Client.socket.emit('itLeft')
  StartScene2.shutDownRoom()
}

Client.socket.on('roomAssign', function(data){
  Client.room = data
  MainMenu2.connectToRoom()
})

Client.socket.on('noRooms', function(){
  MainMenu2.noRooms()
})

Client.socket.on('hitConfirm', function(data){
  StartScene2.receiveDamage(data)
})

Client.socket.on('scoreIncreased', function(data){
  StartScene2.updateScore(data)
})

Client.socket.on('newplayer',function(data){
  StartScene2.addNewPlayer(data.id,data.x,data.y, false);
});

Client.socket.on('allplayers',function(data){
    for(var i = 0; i < data.players.length; i++){
      let user = false
      let it = false
      if (data.players[i].id === data.userId) {
        user = true
      }
      if (data.players[i].id === data.itId) {
        it = true
      }
      StartScene2.addNewPlayer(data.players[i].id,data.players[i].x,data.players[i].y, user, it);
    }

  Client.socket.on('move',function(data){
      StartScene2.movePlayer(data.id,data.x,data.y);
  });

  Client.socket.on('remove',function(id){
      StartScene2.removePlayer(id);
  });
});

