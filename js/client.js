

const Client = {}
Client.socket = io.connect()

Client.sendTest = function() {
  console.log("test sent")
  Client.socket.emit('test')
}

Client.askNewPlayer = function(){
  console.log("making new player requet")
    Client.socket.emit('newplayer');
};

Client.sendPosition = function(x,y){
  Client.socket.emit('move',{x:x,y:y});
};


Client.socket.on('newplayer',function(data){
    //this.player = this.physics.add.sprite(50, 350, "ball").setScale(.3,.3)
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

