//Setup port variable
const port = process.env.port || 4000;

// Setup express
const express = require('express');
let app = express();
app.use(express.static("./public"));
let httpServer = app.listen(port, () => console.log('Listening'));

// Setup socket.io
let io = require('socket.io')(httpServer, {
    cors: {
        origin: "http://127.0.0.1:5500", // for dev: http://127.0.0.1:5500, for prod: http://shithead.onl
        methods: ["GET", "POST"]
    }
});

const Game = require('./gamemodel.js');
let allusers = [];
let allgames = [];
let dailyGames = 0;

function getUsersbyRoom(room) {
    return allusers.filter(user => user.room === room);
};

function getGamebyRoom(room) {
    let game = allgames.find(game => game.room === room);
    if (game === undefined) {
        throw new Error("Could not find game by room. Tried to find room " + room + "in " + allgames);
    }
    return game;
};

function removeGame(g) {
    console.log(new Date().toUTCString() + ': Removing game: ' + g.room);
    let res = allgames.splice(allgames.indexOf(g), 1);
    if (res !== []) {
        console.log('Successfully removed');
    } else {
        console.log('Cound not find game for removal.');
    }
};

function removeAllPlayers(game) {
    let newPayersList = [...allusers].filter((user) => user.room !== game.room);
    allusers = newPayersList;
};

function roomClosed(room) {
    const game = allgames.find(game => game.room === room);
    if (game === undefined) {
        return false;
    }
    return true;
};

io.on('connection', socket => {

    socket.on('join-room', data => {
        const usersInRoom = getUsersbyRoom(data.room);
        if (usersInRoom.length >= 5 || roomClosed(data.room)) {
            io.to(socket.id).emit('cannot-join-anymore');
        } else {
            socket.join(data.room);
            allusers.push({
                id: socket.id,
                name: data.username,
                room: data.room
            });
            io.to(data.room).emit('user-joined', getUsersbyRoom(data.room));
        }
    });

    socket.on('start-game', roomName => {
        let newgame = new Game(roomName, getUsersbyRoom(roomName));
        allgames.push(newgame);
        newgame.players.forEach((player, idx) => {
            io.to(player.id).emit('room-closed', { game: newgame, index: idx });
        });
        console.log(new Date().toUTCString() + ': Started game: ' + newgame.room);
        dailyGames++;
    });

    socket.on('i-am-ready', data => {
        try {
            let game = getGamebyRoom(data.room);
            const updatedGame = game.swapCards(data.index, data.newHandCards, data.newLastCards);
            updatedGame.nrOfReadyPlayers++;
            if (updatedGame.nrOfReadyPlayers === updatedGame.players.length) {
                io.to(data.room).emit('all-ready', updatedGame);
            } else {
                io.to(socket.id).emit('wait-for-others');
            }
        } catch (error) {
            publishError(error, data.room);
        }
    });

    socket.on('move', data => {
        try {
            let targetedGame = getGamebyRoom(data.room);
            if (data.belated) {
                targetedGame.makemove(data.cards, targetedGame.getIndexOfPrevPlayer());
            } else {
                targetedGame.makemove(data.cards, targetedGame.currentPlayerIdx);
            }
            broadcastUpdatedGame(data.room, targetedGame);
            if (targetedGame.isOver) {
                removeGame(targetedGame);
            };
        } catch (err) {
            publishError(err, data.room)
        }
    });

    socket.on('pick-up', room => {
        try {
            let targetedGame = getGamebyRoom(room);
            targetedGame.pickUp();
            broadcastUpdatedGame(room, targetedGame);
        } catch (err) {
            publishError(err, room);
        }
    });

    socket.on('face-up', data => {
        try {
            let g = getGamebyRoom(data.room);
            g.faceUp(data.player, data.flippedCardsIdx);
            broadcastUpdatedGame(data.room, g);
        } catch (err) {
            publishError(err, data.room);
        }
    });

    socket.on('disconnect', (socket) => {
        // add socket.leave for the disconnedted user and for all other users that were in that room
        let player = allusers.find((user) => user.id === socket.id);
        if (player !== undefined) {
            try {
                let canceldGame = getGamebyRoom(player.room);
                io.to(canceldGame.room).emit('coplayer-disconnected');
                removeAllPlayers(canceldGame);
                removeGame(canceldGame);
            } catch (err) {
                publishError(err, player.room);
            }
        }
    });

    function broadcastUpdatedGame(room, updatedGame) {
        io.to(room).emit('move-made', updatedGame);
    };

    socket.on('test-game-req', () => {
        let testgame = new Game('testroom', [
            {
                id: '28378929812',
                name: 'John',
                room: 'testroom'
            }
            , {
                id: '37846538745',
                name: 'asjd',
                room: 'testroom'
            }
        ]);


        testgame.deck = [5];
        testgame.stack = [4];

        testgame.cards[0].handCards = [5, 5, 7];
        testgame.cards[0].lastCards = [5, 6, 7];
        testgame.cards[0].flippedCards = [3, 3, 3];

        testgame.cards[1].handCards = [];
        testgame.cards[1].lastCards = [6];
        testgame.cards[1].flippedCards = [6, 6, 6];

        allgames.push(testgame);
        socket.join('testroom');
        io.to(socket.id).emit('test-game', testgame);
    });

    function publishError(error, room) {
        console.log(new Date() + error);
        io.to(room).emit('error');
    }
});

setInterval(() => {
    console.log(new Date() + ": Started games during the last 24 hours: " + dailyGames);
    dailyGames = 0;
}, 86400000);
