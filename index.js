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

server.lastPlayderID = 1;
server.rooms = []

io.on('connection',function(socket){

    socket.on('newRoom', function() {
        let roomInfo = {id: uuidv1(), seed: Math.round(Math.random()*100), it: false, players: 1}
        server.rooms.push(roomInfo)
        socket.join(roomInfo.id)
        socket.emit('roomAssign', roomInfo)
    })

    socket.on('joinRoom', function(){
        if (server.rooms.length === 0){
            socket.emit('noRooms')
        } else {
            if (server.rooms[0] && server.rooms[0].players <= 4){
                socket.join(server.rooms[0].id)
                server.rooms[0].players ++
                socket.emit('roomAssign', server.rooms[0])
            } else if (server.rooms[1]) {
                socket.join(server.rooms[1].id)
                server.rooms[1].players ++
                socket.emit('roomAssign', server.rooms[1])
                server.rooms.shift()
            } else {
                socket.emit('noRooms')
            }
        }
    })

    socket.on('newplayer',function(room){
        let it
        socket.player = {
            id: uuidv1(),
            x: randomInt(100,400),
            y: randomInt(100,400),
            room: room
        };
        for (let gameRoom in server.rooms) {
            if (server.rooms[gameRoom].id === room && !server.rooms[gameRoom].it){
                server.rooms[gameRoom].it = socket.player.id
                it = socket.player.id
            } else if (server.rooms[gameRoom].id === room && server.rooms[gameRoom].it){
                it = server.rooms[gameRoom].it
            }
        }
        socket.emit('allplayers',{players: getAllPlayers(room), userId: socket.player.id, itId: it});
        socket.broadcast.to(room).emit('newplayer',socket.player);

        socket.on('move',function(data){
            socket.player.x = data.x;
            socket.player.y = data.y;
            io.to(room).emit('move',socket.player);
        });

        socket.on('playerHit', function(data){
            io.to(room).emit('hitConfirm', data.id)
        })

        socket.on('itLeft', function() {
            for (let gameRoom in server.rooms) {
                if (server.rooms[gameRoom].id === room){
                    server.rooms.splice(gameRoom, 1)
                }
            }
            socket.leave(room)
        })

        socket.on('disconnect',function(){
            for (let gameRoom in server.rooms) {
                if (server.rooms[gameRoom].id === room){
                    server.rooms[gameRoom].players --
                    if (server.rooms[gameRoom].players <= 0){
                        server.rooms.splice(gameRoom, 1)
                    }
                }
            }
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
