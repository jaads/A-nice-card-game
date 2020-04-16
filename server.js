const express = require('express');
const socket = require('socket.io');

// Setup
let app = express();
app.use(express.static("./public"))
let server = app.listen(4000, () => console.log('Listening'))
let io = socket(server);

let allusers = [];
let closedRooms = [];

function getUsersFromRoom(room) {
    tmp = [];
    allusers.forEach(element => {
        if (element.room == room) {
            tmp.push(element);
        }
    });
    return tmp;
};

io.on('connection', socket => {

    console.log("user connected");
    io.to(socket.id).emit('initialClosedRooms', closedRooms);

    function broadcastClosedRooms() {
        io.emit('closedRooms', closedRooms);
    };
    
    socket.on('join room', data => {
        socket.join(data.room);
        let user = {
            id: socket.id,
            name: data.user,
            room: data.room
        };
        allusers.push(user);
        io.to(data.room).emit('new user in room', getUsersFromRoom(data.room));
        console.log('User ' + data.user + ' joined room ' + data.room);
    });

    socket.on('start-game', roomName => {
        closedRooms.push(roomName);
        broadcastClosedRooms();
        io.to(roomName).emit('game-started', {
            room: roomName,
            currPlayerIdx: 0
        })
    });

    socket.on('make_move', move => {
        socket.to(move.room).emit('move_made', 'a move was made. next one..');
    });

    socket.on('disconnect', () => {
        io.emit('user left', 'A user left the room.')
    })

});
