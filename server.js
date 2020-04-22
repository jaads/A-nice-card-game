const express = require('express');
const socket = require('socket.io');

// Setup
let app = express();
app.use(express.static("./public"))
let server = app.listen(4000, () => console.log('Listening'))
let io = socket(server);

let allusers = [];
let allgames = [];
let dailyGames = 0;

function getUsersbyRoom(room) {
    return allusers.filter(user => user.room == room);
};

function getGamebyRoom(room) {
    return allgames.filter((game) => game.room = room)[0];
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
        newgame = new Game(roomName, getUsersbyRoom(roomName));
        allgames.push(newgame);
        io.to(roomName).emit('game-started', newgame);
        io.to(socket.id).emit('user-index', getPlayersIndex(roomName));
        dailyGames ++;
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

    function getPlayersIndex(room) {
        return getUsersbyRoom(room).map((e) => e.id).indexOf(socket.id);
    }

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

setInterval(() => {
    console.log("Started games during the last 24 hours: " + dailyGames);
}, 86400000);

class Game {

    constructor(room, players) {
        this.room = room;
        this.deck = getSuffledDeck();
        this.players = players;
        this.currentPlayerIdx = 0;
        this.cards = handOutCards(this.deck, this.players);
        this.outOfGameCards = [];
        this.stack = this.initstack();
    }

    getCardFromDeck() {
        return this.deck.pop();
    };

    initstack() {
        let firstCard = this.getCardFromDeck();
        while (firstCard == 10) {
            this.outOfGameCards.push(firstCard);
            console.log("First card was a 10.");
            firstCard = this.getCardFromDeck();
        }
        return [firstCard];
    };

    makemove(playedCards) {
        let playersCardsOnFirstStage = this.cards[this.currentPlayerIdx].handCards;
        let playersCardsOnSecondStage = this.cards[this.currentPlayerIdx].handCards;
        let playersCardsOnThirdStage = this.cards[this.currentPlayerIdx].handCards;


        // Remove card from hand
        playedCards.forEach((card) => {
            if (playersCardsOnFirstStage.length > 0) {
                let index = playersCardsOnFirstStage.indexOf(card);
                playersCardsOnFirstStage.splice(index, 1);
            } else if (playersCardsOnSecondStage.length > 0) {
                let index = playersCardsOnSecondStage.indexOf(card);
                playersCardsOnSecondStage.splice(index, 1);
            } else if (playersCardsOnThirdStage.length > 0) {
                let index = playersCardsOnThirdStage.indexOf(card);
                playersCardsOnThirdStage.splice(index, 1);
            }
            // Put on stack
            this.stack.push(card);

        });
        // Get new card from deck if needed
        while (this.deck.length > 0 && playersCardsOnFirstStage.length < 3) {
            this.cards[this.currentPlayerIdx].handCards.push(this.getCardFromDeck());
        }

        if (playedCards[0] != 10) {
            this.setNextPlayer();
        } else {
            while (this.stack.length > 0) {
                this.outOfGameCards.push(this.stack.pop());
            }
        }

    };

    pickUp() {
        while (this.stack.length > 0) {
            this.cards[this.currentPlayerIdx].handCards.push(this.stack.pop());
        }
        this.setNextPlayer();
    };

    setNextPlayer() {
        if (this.stack[this.stack.length - 1] != 8) {
            this.currentPlayerIdx = (this.currentPlayerIdx + 1) % this.players.length;
        } else {
            this.currentPlayerIdx = (this.currentPlayerIdx + 2) % this.players.length;
        }
    };

};
