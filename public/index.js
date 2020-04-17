let socket = io.connect('http://localhost:4000');
let mates = document.querySelector('#currentroommates');
let nameinput = document.querySelector('#name');
let newroominput = document.querySelector('#createroominput');
let createbtn = document.querySelector('#createroombtn');
let startbtn = document.querySelector('#startbtn');
let playercount = document.querySelector('#playercount');
let currentCard = document.querySelector('#currentcard');
let cardinput = document.querySelector('#cardinput');

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
});

socket.on('user-index', indexParam => {
    playersIndex = indexParam;
    console.log("your index is:" + playersIndex);

    console.log("Yore're cards on table are:");
    console.log(game.cards[playersIndex]);
});

socket.on('move-made', updatedGame => {
    game = updatedGame;
    renderCurrentCard();
    printCurrentPlayer();
});

cardinput.onkeyup = (e) => {
    if (currentlyInGame) {
        let mappedCardInput = isNaN(e.key) ? getNumberMapping(e.key) : e.key;
        let validMove = isValidMove(game.previousCard, game.currentCard, mappedCardInput);
        let isActuallyOnHand = game.cards[game.currentPlayerIdx].handCards.includes(Number(mappedCardInput));

        console.log(mappedCardInput);
        console.log(game.cards[game.currentPlayerIdx].handCards);
        console.log(isActuallyOnHand);
        
        
        if (game.currentPlayerIdx == playersIndex) {
            console.log(game.previousCard + " " + game.currentCard + " " + mappedCardInput);
            if (isActuallyOnHand) {
                if (validMove) {
                    console.log("valid move");
                    socket.emit("move", { room: game.room, card: mappedCardInput });
                } else {
                    console.log("not valid move");
                }
            } else {
                console.log("Seems the card is not on your hand.");  
            }
        } else {
            console.log("It's not your turn..");
        }

        cardinput.value = '';
    }
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

function renderCurrentCard() {
    currentCard.innerText = game.currentCard;
};