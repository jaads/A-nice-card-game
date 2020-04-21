let socket = io.connect('http://localhost:4000');
let nameinput = document.querySelector('#name');
let newroominput = document.querySelector('#createroominput');
let createbtn = document.querySelector('#createroombtn');
let startbtn = document.querySelector('#startbtn');
let playercount = document.querySelector('#playercount');
let cardinput = document.querySelector('#cardinput');
let pickupbtn = document.querySelector('#pickupbtn');

import { isValidMove, getNumberMapping } from './card-logic.js';
import { renderCards, showAmountInput, showplayers, updateView  } from './rendering-module.js';

export let roommates = [];
export let game = null;
export let playersIndex = null;

let notavailablerooms = [];
let currentlyInGame = false;

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

socket.on('new user in room', data => {
    roommates = data;
    playercount.innerText = roommates.length;
    showplayers();
});

socket.on('initialClosedRooms', closedRooms => {
    notavailablerooms = closedRooms;
    console.log("These games are currently running:");
    console.log(closedRooms);
});

socket.on('closedRooms', closedRooms => {
    notavailablerooms = closedRooms;
});

socket.on('game-started', gameparam => {
    console.log('The game has started.');
    currentlyInGame = true;
    game = gameparam;
    cardinput.focus();
    socket.emit('get-users-index', newroominput.value);
    updateView();
});

socket.on('user-index', indexParam => {
    playersIndex = indexParam;
    renderCards(game, playersIndex);
});

socket.on('move-made', updatedGame => {
    game = updatedGame;
    renderCards(game, playersIndex);
    updateView();
});

cardinput.onkeyup = (e) => {
    let mappedCardInput = isNaN(e.key) ? getNumberMapping(e.key) : Number(e.key);
    if (e.key == 'Enter') {
        pickUpCards();
        return;
    }
    cardinput.value = '';
};

pickupbtn.onclick = pickUpCards;

function pickUpCards() {
    socket.emit('pick-up', game.room);
};

export function decideAmount(playedCard) {
    let tmp = game.cards[game.currentPlayerIdx].handCards.filter((card) => card == playedCard);
    if (tmp.length > 1) {
        showAmountInput(tmp);
    } else {
        tryMakeAMove([playedCard]);
    }
};

export function tryMakeAMove(playedCardArr) {
    if (currentlyInGame) {
        if (game.currentPlayerIdx == playersIndex) {
            let playersCardsOnFirstStage = game.cards[game.currentPlayerIdx].handCards;
            let playersCardsOnSecondStage = game.cards[game.currentPlayerIdx].lastCards;
            let playersCardsOnLastStage = game.cards[game.currentPlayerIdx].lastCards;
            let cardNumber = playedCardArr[0];
            if (isValidMove(getPreviousCard(), getCurrentCard(), cardNumber)) {
                if (playersCardsOnFirstStage.length > 0) {
                    if (playersCardsOnFirstStage.includes(cardNumber)) {
                        socket.emit("move", { room: game.room, cards: playedCardArr });
                    } else {
                        console.log("This card is not availbale to you on the first stage.");
                    }
                } else if (playersCardsOnSecondStage.length > 0) {
                    if (playersCardsOnSecondStage.includes(cardNumber)) {
                        socket.emit("move", { room: game.room, cards: playedCardArr });
                    } else {
                        console.log("This card is not availbale to you on the first stage.");
                    }
                } else if (playersCardsOnLastStage.length > 0) {
                    if (playersCardsOnLastStage.includes(cardNumber)) {
                        socket.emit("move", { room: game.room, cards: playedCardArr });
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

