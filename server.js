const express = require('express');
const socket = require('socket.io');

// Setup
let app = express();
app.use(express.static("./public"))
let server = app.listen(4000, () => console.log('Listening'))
let io = socket(server);

let allusers = [];
let closedRooms = [];
let allgames = [];

function getUsersbyRoom(room) {
    return allusers.filter(user => user.room == room);
};

function getGamebyRoom(room) {
    return allgames.filter((game) => game.room = room)[0];
}

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
        io.to(data.room).emit('new user in room', getUsersbyRoom(data.room));
        console.log('User ' + data.user + ' joined room ' + data.room);
    });

    socket.on('start-game', roomName => {
        // Close room
        closedRooms.push(roomName);
        broadcastClosedRooms();

        // Setup game
        newgame = new Game(roomName, getUsersbyRoom(roomName));
        allgames.push(newgame);

        // Send game to everyone in room
        io.to(roomName).emit('game-started', newgame);
    });

    socket.on('move', data => {
        let targetedGame = getGamebyRoom(data.room);
        targetedGame.makemove(data.card);
        console.log("move was made");
        io.to(data.room).emit('move-made', targetedGame);
    });

    socket.on('pick-up', room => {
        let targetedGame = getGamebyRoom(room);
        targetedGame.pickUp();
        io.to(room).emit('move-made', targetedGame);
    });

    function getPlayersIndex(room) {
        return getUsersbyRoom(room).map((e) => e.id).indexOf(socket.id);
    }

    socket.on('get-users-index', room => {
        io.to(socket.id).emit('user-index', getPlayersIndex(room));
    });

    socket.on('disconnect', () => {
        io.emit('user left', 'A user left the room.')
    })

});

function getDeck() {
    let values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    let deck = []
    values.forEach((elem) => {
        for (let i = 0; i < 4; i++) {
            deck.push(elem);
        }
    });
    return deck;
};

// Nice in-place O(n) shuffle thanks to this post: https://bost.ocks.org/mike/shuffle/
function shuffle(array) {
    var m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
};

function getSuffledDeck() {
    return shuffle(getDeck());
};

function handOutCards(deck, players) {
    let tmp = [];
    players.forEach(() => {
        let playersCards = {
            flippedCards: [deck.pop(), deck.pop(), deck.pop()],
            lastCards: [deck.pop(), deck.pop(), deck.pop()],
            handCards: [deck.pop(), deck.pop(), deck.pop()],
        };
        tmp.push(playersCards);
    });
    return tmp;
};

class Game {

    constructor(room, players) {
        this.room = room;
        this.deck = getSuffledDeck();
        this.players = players;
        this.currentPlayerIdx = 0;
        this.cards = handOutCards(this.deck, this.players);
        this.previousCard = 1;
        this.stack = [this.getCardFromDeck()];
    }

    getCardFromDeck() {
        return this.deck.pop();
    };

    makemove(card) {
        // Remove card from hand   
        let index = this.cards[this.currentPlayerIdx].handCards.indexOf(Number(card));
        this.cards[this.currentPlayerIdx].handCards.splice(index, 1);

        // Put on stack
        this.stack.push(card);

        // Get new card from deck if needed
        if (this.cards[this.currentPlayerIdx].handCards.length < 3) {
            if (this.deck.length > 0) {
                this.cards[this.currentPlayerIdx].handCards.push(this.getCardFromDeck());
            }
        }

        // Set next player
        this.setNextPlayer();
    };

    pickUp() {
        this.stack.forEach(() => {
            this.cards[this.currentPlayerIdx].handCards.push(this.stack.pop());
        });
        if (this.deck.length > 0) {
            this.stack.push(this.getCardFromDeck());
        }
        this.setNextPlayer();
    };

    setNextPlayer() {
        this.currentPlayerIdx = (this.currentPlayerIdx + 1) % this.players.length;
    };

    print() {
        for (let i = 0; i < this.players.length; i++) {
            console.log(this.players[i].name);
            console.log(this.cards[i]);
        }
    }

};
