let socket = io.connect('http://localhost:4000');
let mates = document.querySelector('#currentroommates');
let nameinput = document.querySelector('#name');
let newroominput = document.querySelector('#createroominput');
let createbtn = document.querySelector('#createroombtn');
let startbtn = document.querySelector('#startbtn');
let playercount = document.querySelector('#playercount');
let currentCard = document.querySelector('#currentcard');
let prevcard = document.querySelector('#prevcard');
let cardinput = document.querySelector('#cardinput');
let cardsOnHandDiv = document.querySelector('#cardsonhanddiv');
let cardsOnTableDiv = document.querySelector('#cardsontablediv');
let NrOfCardsOnStack = document.querySelector('#NrOfCardsOnStack');
let decksize = document.querySelector('#decksize');
let pickupbtn = document.querySelector('#pickupbtn');

import { isValidMove, getNumberMapping } from './card-logic.js';

let roommates = [];
let notavailablerooms = [];
let currentlyInGame = false;
let game = null;
let playersIndex = null;

createbtn.onclick = () => {
    let roomClosed = notavailablerooms.includes(newroominput.value);
    if (roomClosed) {
        console.log('You cannt join anymore. A game already started in this room.');
    } else {
        socket.emit('join room',
            {
                user: nameinput.value,
                room: newroominput.value
            });
    }
};

startbtn.onclick = () => {
    if (roommates.length > 0) {
        socket.emit('start-game', newroominput.value);
    } else {
        console.log("No players yet.");
    }
};

socket.on('initialClosedRooms', (closedRooms) => {
    notavailablerooms = closedRooms;
    console.log("These games are currently running:");
    console.log(closedRooms);
});

socket.on('closedRooms', (closedRooms) => {
    notavailablerooms = closedRooms;
});

socket.on('game-started', gameparam => {
    console.log('The game has started.');
    currentlyInGame = true;
    game = gameparam;
    cardinput.focus();
    socket.emit('get-users-index', newroominput.value);
    renderCurrentCard();
    printCurrentPlayer();
    updateNumberOfCardsOnStack();
});

socket.on('user-index', indexParam => {
    playersIndex = indexParam;
    renderCards();
});

socket.on('move-made', updatedGame => {
    game = updatedGame;
    renderCurrentCard();
    printCurrentPlayer();
    renderCards();
    updateNumberOfCardsOnStack();
});

cardinput.onkeyup = (e) => {
    let mappedCardInput = isNaN(e.key) ? getNumberMapping(e.key) : Number(e.key);
    if (e.key == 'Enter') {
        pickUpCards();
        return;
    }
    tryMakeAMove(mappedCardInput);
    cardinput.value = '';
};

pickupbtn.onclick = pickUpCards;

function pickUpCards() {
    socket.emit('pick-up', game.room);
};

function tryMakeAMove(playedCard) {
    if (currentlyInGame) {
        if (game.currentPlayerIdx == playersIndex) {
            let playersCardsOnFirstStage = game.cards[game.currentPlayerIdx].handCards;
            let playersCardsOnSecondStage = game.cards[game.currentPlayerIdx].lastCards;
            let playersCardsOnLastStage = game.cards[game.currentPlayerIdx].lastCards;


            if (isValidMove(getPreviousCard(), getCurrentCard(), playedCard)) {


                if (playersCardsOnFirstStage.length > 0) {
                    if (playersCardsOnFirstStage.includes(playedCard)) {
                        socket.emit("move", { room: game.room, card: playedCard });
                    } else {
                        console.log(playedCard);

                        console.log("This card is not availbale to you on the first stage.");
                    }
                } else if (playersCardsOnSecondStage.length > 0) {
                    if (playersCardsOnSecondStage.includes(playedCard)) {
                        socket.emit("move", { room: game.room, card: playedCard });
                    } else {
                        console.log("This card is not availbale to you on the first stage.");
                    }
                } else if (playersCardsOnLastStage.length > 0) {
                    if (playersCardsOnLastStage.includes(playedCard)) {
                        socket.emit("move", { room: game.room, card: playedCard });
                    } else {
                        console.log("This card is not availbale to you on the first stage.");
                    }
                } else {
                    console.log("yeaah YOU WON!!!!");
                }


            } else {
                console.log("not valid move");
            }
        } else {
            console.log("It's not your turn..");
        }
    }
}

function getCurrentCard() {
    return game.stack[game.stack.length - 1] != undefined ? game.stack[game.stack.length - 1] : 1;
};

function getPreviousCard() {
    return game.stack[game.stack.length - 2] != undefined ? game.stack[game.stack.length - 2] : 1;
};

function printCurrentPlayer() {
    console.log("It's " + game.players[game.currentPlayerIdx].name + " turn.");
};

socket.on('new user in room', (data) => {
    roommates = data;
    playercount.innerText = roommates.length;
    showplayers();
});

function showplayers() {
    mates.innerHTML = '';
    roommates.forEach(element => {
        let para = document.createElement("p");
        let node = document.createTextNode(element.name);
        para.appendChild(node);
        mates.appendChild(para)
    });
};

function updateNumberOfCardsOnStack() {
    NrOfCardsOnStack.innerText = game.stack.length;
    decksize.innerText = game.deck.length;
};

function renderCurrentCard() {
    if (game.stack.length > 0) {
        currentCard.innerText = game.stack[game.stack.length - 1];
    } else {
        currentCard.innerHTML = "&empty;";
    }

    if (game.stack.length >= 2) {
        prevcard.innerText = game.stack[game.stack.length - 2];
    } else {
        prevcard.innerHTML = "&empty;";
    }
};

function renderCards() {
    cardsOnHandDiv.innerHTML = '';
    game.cards[playersIndex].handCards.forEach(card => {
        let newdiv = document.createElement('div');
        newdiv.classList.add('margin', 'badge', 'acard');
        let node = document.createTextNode(card);
        newdiv.appendChild(node);
        cardsOnHandDiv.appendChild(newdiv);
        newdiv.onclick = () => {
            tryMakeAMove(Number(newdiv.textContent));
        };
    });

    cardsOnTableDiv.innerHTML = '';
    game.cards[playersIndex].lastCards.forEach(card => {
        let newdiv = document.createElement('div');
        newdiv.classList.add('margin', 'badge', 'acard');
        let node = document.createTextNode(card);
        newdiv.appendChild(node);
        cardsOnTableDiv.appendChild(newdiv);
        newdiv.onclick = () => {
            tryMakeAMove(Number(newdiv.textContent));
        };
    });
};