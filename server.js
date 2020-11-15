const express = require('express');
const socket = require('socket.io');
const Game = require('./gamemodel.js');

// Setup
let app = express();
const port = process.env.port || 4000;
app.use(express.static("./public"));
let server = app.listen(port, () => console.log('Listening'));
let io = socket(server);

let allusers = [];
let allgames = [];
let dailyGames = 0;

function getUsersbyRoom(room) {
    return allusers.filter(user => user.room == room);
};

function getGamebyRoom(room) {
    let game = allgames.find(game => game.room == room);
    if (game == undefined) {
        console.log("Could not find game by room. Tryied to find room " + room + "in " + allgames);
    }
    return game;
};

function removeGame(g) {
    console.log('Removing game: ' + g.room);
    let res = allgames.splice(allgames.indexOf(g), 1);
    if (res != []) {
        console.log('Removed.');
    } else {
        console.log('Cound not find game for removal.');
    }
};

function removeAllPlayers(game) {
    let newPayersList = [...allusers].filter((user) => user.room != game.room);
    allusers = newPayersList;
};

function isGameRunning(room) {
    let tmp = allgames.filter(game => game.room == room);
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
        console.log('Game started: ' + newgame.room);
        dailyGames++;
    });

    socket.on('swap-cards', data => {
        // TypeError: Cannot read property 'swapCards' of undefined
        let game = getGamebyRoom(data.room)
        if (game != undefined) {
            g.swapCards(data.index, data.newHandCards, data.newLastCards);
        }
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
        if (data.belated) {
            targetedGame.makemove(data.cards, targetedGame.getIndexOfPrevPlayer());
        } else {
            targetedGame.makemove(data.cards, targetedGame.currentPlayerIdx);
        }
        broadcastUpdatedGame(data.room, targetedGame);
        if (targetedGame.isOver) {
            removeGame(targetedGame);
        };
    });

    socket.on('pick-up', room => {
        let targetedGame = getGamebyRoom(room);
        targetedGame.pickUp();
        broadcastUpdatedGame(room, targetedGame);
    });

    socket.on('face-up', data => {
        let g = getGamebyRoom(data.room);
        g.faceUp(data.player, data.flippedCardsIdx);
        broadcastUpdatedGame(data.room, g);
    });

    socket.on('disconnect', () => {
        let player = allusers.find((user) => user.id == socket.id);
        if (player != undefined) {
            let canceldGame = getGamebyRoom(player.room);
            // Hotfix for server crahses 'TypeError: Cannot read property 'room' of undefined' 
            // TODO: why undefiend?
            if (canceldGame != undefined) {
                io.to(canceldGame.room).emit('coplayer-disconnected');
                removeAllPlayers(canceldGame);
                removeGame(canceldGame);
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
});

setInterval(() => {
    console.log("Started games during the last 24 hours: " + dailyGames);
    console.log("Currently active games: " + allgames.length);
    console.log("Currently active users: " + allusers.length);
}, 86400000);
