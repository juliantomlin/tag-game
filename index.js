var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
const uuidv1 = require('uuid/v1')

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

server.lastPlayderID = 0;
server.rooms = []

io.on('connection',function(socket){

    socket.on('newRoom', function() {
        let roomInfo = {id: uuidv1(), seed: Math.round(Math.random()*100)}
        server.rooms.push(roomInfo)
        socket.join(roomInfo.id)
        io.emit('roomAssign', roomInfo)
    })

    socket.on('joinRoom', function(){
        io.emit('roomAssign', server.rooms[0])
    })

    socket.on('newplayer',function(room){
        console.log(room)
        socket.player = {
            id: server.lastPlayderID++,
            x: randomInt(100,400),
            y: randomInt(100,400),
            room: room
        };
        socket.emit('allplayers',getAllPlayers(room));
        socket.broadcast.to(room).emit('newplayer',socket.player);

        socket.on('move',function(data){
            socket.player.x = data.x;
            socket.player.y = data.y;
            io.to(room).emit('move',socket.player);
        });

        socket.on('playerHit', function(data){
            io.to(room).emit('hitConfirm', data.id)
        })

        socket.on('disconnect',function(){
            io.to(room).emit('remove',socket.player.id);
        });
    });

});

function getAllPlayers(roomId){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player && player.room === roomId) players.push(player);
    });
    return players;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}


server.listen(process.env.PORT || 3001, function() {
  console.log('Listening :3001');
});
