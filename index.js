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


    // starts a new game as the 'killer' player
    socket.on('newRoom', function() {
        let roomInfo = {id: uuidv1(), seed: Math.round(Math.random()*1000), it: false, players: 1}
        server.rooms.push(roomInfo)
        socket.join(roomInfo.id)
        socket.emit('roomAssign', roomInfo)
    })

    //joins a game as a 'survivor' player
    socket.on('joinRoom', function(){
        if (server.rooms[0] && server.rooms[0].players <= 0){
            server.rooms.splice(0, 1)
        }
        //if there are no room that can be joined displays error message 'no rooms'
        if (server.rooms.length === 0){
            socket.emit('noRooms')
        } else {
            //join the first room in list as long as that room has less than 4 players
            if (server.rooms[0] && server.rooms[0].players <= 4){
                socket.join(server.rooms[0].id)
                server.rooms[0].players ++
                socket.emit('roomAssign', server.rooms[0])
            // if the first room in list is full, join the 2nd room and remove the first room from the list
            } else if (server.rooms[1]) {
                socket.join(server.rooms[1].id)
                server.rooms[1].players ++
                socket.emit('roomAssign', server.rooms[1])
                server.rooms.shift()
            // if the first room is full and there is no 2nd room display error message 'no rooms'
            } else {
                socket.emit('noRooms')
            }
        }
    })

    socket.on('newplayer',function(room){
        console.log(room)
        let it
        socket.player = {
            id: uuidv1(),
            x: randomInt(100,1150),
            y: randomInt(100,1150),
            room: room,
            score: 0
        };
        for (let gameRoom in server.rooms) {
            // if no one is killer, make the current player killer
            if (server.rooms[gameRoom].id === room && !server.rooms[gameRoom].it){
                server.rooms[gameRoom].it = socket.player.id
                it = socket.player.id
            // if some one is killer, assign the killer id to the room id
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
            let hurtId
            Object.keys(io.sockets.connected).forEach(function(socketID){
                var player = io.sockets.connected[socketID].player;
                if(player && player.id === data.id) {
                    hurtId = socketID
                    io.sockets.connected[socketID].player.score = Math.floor(io.sockets.connected[socketID].player.score / 2)
                }
            })
            io.to(room).emit('hitConfirm', data.id)
            io.to(room).emit('scoreIncreased', {id:data.id,score:io.sockets.connected[hurtId].player.score})
        })

        socket.on('increaseScore', function(data){
            socket.player.score = data.score
            io.to(room).emit('scoreIncreased', data)
        })

        socket.on('itLeft', function() {
            for (let gameRoom in server.rooms) {
                if (server.rooms[gameRoom].id === room){
                    server.rooms.splice(gameRoom, 1)
                }
            }
            socket.player.score = 0
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

//returns a list of all connect players
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


server.listen(process.env.PORT || 3000, function() {
  console.log('Listening :3000');
});
