

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

Client.sendClick = function(x,y){
  Client.socket.emit('click',{x:x,y:y});
};

Client.socket.on('newplayer',function(data){
    //this.player = this.physics.add.sprite(50, 350, "ball").setScale(.3,.3)
    StartScene.addNewPlayer(data.id,data.x,data.y);
});

Client.socket.on('allplayers',function(data){
  console.log('newplayer data received')
  console.log('client.js', game)
    for(var i = 0; i < data.length; i++){
      // const test = new StartScene
      // console.log(test)
        StartScene2.addNewPlayer(data[i].id,data[i].x,data[i].y);
    }

    Client.socket.on('move',function(data){
        StartScene.movePlayer(data.id,data.x,data.y);
    });

    Client.socket.on('remove',function(id){
        StartScene.removePlayer(id);
    });
});