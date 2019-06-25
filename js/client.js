

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

Client.itLeft = function() {
  Client.socket.emit('itLeft')
}

Client.socket.on('roomAssign', function(data){
  Client.room = data
})

Client.socket.on('hitConfirm', function(data){
  StartScene2.receiveDamage(data)
})

Client.socket.on('newplayer',function(data){
    StartScene2.addNewPlayer(data.id,data.x,data.y, false);
});

Client.socket.on('allplayers',function(data){
    for(var i = 0; i < data.length; i++){
      // const test = new StartScene
      // console.log(test)
      let user = false
      if (i === data.length - 1) {
        user = true
      }
      StartScene2.addNewPlayer(data[i].id,data[i].x,data[i].y, user);
    }

  Client.socket.on('move',function(data){
      StartScene2.movePlayer(data.id,data.x,data.y);
  });

  Client.socket.on('remove',function(id){
      StartScene2.removePlayer(id);
  });
});

