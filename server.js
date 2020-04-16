const express = require('express');
const socket = require('socket.io');

// Setup
let app = express();
app.use(express.static("./public"))
let server = app.listen(4000, () => console.log('Listening'))
let io = socket(server);

let allusers = [];
let closedRooms = [];

function getUsersbyRoom(room) {
    tmp = [];
    allusers.forEach(user => {
        if (user.room == room) {
            tmp.push(user);
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
        io.to(data.room).emit('new user in room', getUsersbyRoom(data.room));
        console.log('User ' + data.user + ' joined room ' + data.room);
    });

    socket.on('start-game', roomName => {
        // Close room
        closedRooms.push(roomName);
        broadcastClosedRooms();

        // Setup game
        newgame = new Game(roomName, getUsersbyRoom(roomName));

        // Send game to everyone in room
        io.to(roomName).emit('game-started', newgame)
    });

    socket.on('move', data => {
        console.log(data.game);
    
        // socket.to(move.room).emit('move_made', 'a move was made. next one..');
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
        this.currentCard = this.getCardFromDeck();
    }

    getCardFromDeck() {
        return this.deck.pop();
    };

    makemove(card) {
        // Remove card from hand   
        let index = this.cards[this.currentPlayerIdx].handCards.indexOf(card);
        this.cards[this.currentPlayerIdx].handCards.splice(index, 1);

        // Put on stack
        this.previousCard = this.currentCard;
        this.currentCard = card;

        // Get new card from deck if needed
        if (this.cards[this.currentPlayerIdx].handCards.length < 3) {
            if (this.deck.length > 0) {
                this.cards[this.currentPlayerIdx].handCards.push(this.getCardFromDeck());
            }
        }

        // Set next player
        this.currentPlayerIdx = (this.currentPlayerIdx + 1) % this.players.length;

    };


    print() {
        for (let i = 0; i < this.players.length; i++) {
            console.log(this.players[i].name);
            console.log(this.cards[i]);
        }
    }

};
