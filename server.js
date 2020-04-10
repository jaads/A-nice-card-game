const express = require('express');
const socket = require('socket.io');

// Setup
let app = express();
app.use(express.static("./public"))
let server = app.listen(4000, () => console.log('Listening'))
let io = socket(server);

io.on('connection', socket => {
    console.log("user connected");
    users = [];

    function usersInRoom(room) {
        tmp = [];
        users.forEach(element => {
            if (element.room == room) {
                tmp.push(element);
            }
        });
        return tmp;
    }

    socket.on('join room', data => {
        socket.join(data.room);
        let user = {
            id: socket.id,
            name: data.user,
            room: data.room
        };
        users.push(user);
        io.to(data.room).emit('new user in room', usersInRoom(data.room));
        console.log('User ' + data.user + ' joined room ' + data.room);
    });

        io.to(data.room).emit('new user in room', data.user + ' ist auch dabei.');
        io.to(data.room).emit('userslist', usersInRoom(data.room) );
        console.log('User ' + data.user + ' joined room ' + data.room);
    });

    socket.on('disconnect', () => {
        io.emit('user left', 'A user left the room.')
    })

});
