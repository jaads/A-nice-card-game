const express = require('express');
const socket = require('socket.io');
const Game = require('./gamemodel.js');

// Setup
let app = express();
const port = process.env.port || 4000
app.use(express.static("./public"))
let server = app.listen(port, () => console.log('Listening'))
let io = socket(server);

let allusers = [];
let allgames = [];
let dailyGames = 0;

function getUsersbyRoom(room) {
    return allusers.filter(user => user.room == room);
};

function getGamebyRoom(room) {
    return allgames.filter(game => game.room == room)[0];
};

function isGameRunning(room) {
    let tmp = [];
    allgames.forEach(element => {
        if (element.room == room) {
            tmp.push(element)
        }
    });
    return tmp.length >= 1;
};

io.on('connection', socket => {

    socket.on('join-room', data => {
        let reachedMaxAmountOfPlayers = getUsersbyRoom(data.room).length >= 5;
        let roomIsAlreadyPlaying = isGameRunning(data.room);
        if (reachedMaxAmountOfPlayers || roomIsAlreadyPlaying) {
            io.to(socket.id).emit('full-room');
        } else {
            socket.join(data.room);
            let user = {
                id: socket.id,
                name: data.user,
                room: data.room
            };
            allusers.push(user);
            io.to(data.room).emit('user-joined', getUsersbyRoom(data.room));
        }
    });

    socket.on('start-game', roomName => {
        let newgame = new Game(roomName, getUsersbyRoom(roomName));
        allgames.push(newgame);
        newgame.players.forEach((player, idx) => {
            io.to(player.id).emit('room-closed', { game: newgame, index: idx });
        });
        dailyGames++;
    });

    socket.on('swap-cards', data => {
        getGamebyRoom(data.room).cards[data.index].handCards = data.newHandCards;
        getGamebyRoom(data.room).cards[data.index].lastCards = data.newLastCards;
    });

    socket.on('i-am-ready', room => {
        let g = getGamebyRoom(room);
        g.nrofreadyplayers++;
        if (g.nrofreadyplayers == g.players.length) {
            io.to(room).emit('all-ready', getGamebyRoom(room));
        } else {
            io.to(socket.id).emit('wait-for-others-to-swap');
        }
    });

    socket.on('move', data => {
        let targetedGame = getGamebyRoom(data.room);
        targetedGame.makemove(data.cards);
        io.to(data.room).emit('move-made', targetedGame);
    });

    socket.on('pick-up', room => {
        let targetedGame = getGamebyRoom(room);
        targetedGame.pickUp();
        io.to(room).emit('move-made', targetedGame);
    });

    socket.on('disconnect', () => {
        // Remove user from list of current players
        allusers.forEach((user, idx) => {
            if (user.id == socket.id) {
                allusers.splice(idx, 1);
            }
        });
    });
});

setInterval(() => {
    console.log("Started games during the last 24 hours: " + dailyGames);
}, 86400000);

