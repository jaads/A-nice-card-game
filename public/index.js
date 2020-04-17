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
let currentplayerIdx = 0;
let currentlyInGame = false;
let game = null;

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
    console.log(game);
    currentCard.innerText = game.currentCard;
    cardinput.focus();
    socket.emit('get-users-index', newroominput.value );
    // printCurrentPlayer();
});

socket.on('user-index', myindex => {
    console.log("Yore're cards on table are: ");
    console.log(game.cards[myindex]);
});


cardinput.onkeyup = (e) => {
    if (currentlyInGame) {
        let mappedCardInput = isNaN(e.key) ? getNumberMapping(e.key) : e.key;
        let validMove = isValidMove(game.previousCard, game.currentCard, mappedCardInput);
        let isActuallyOnHand = game.cards[currentplayerIdx].handCards.includes(mappedCardInput);

        if (validMove && isActuallyOnHand) {
            console.log("valid move");
            socket.emit("move", { game: game, card: mappedCardInput });
        } else {
            console.log("not valid move");
        }
        cardinput.value = '';
    }
};

socket.on('move_made', msg => {
    currentplayerIdx = (currentplayerIdx + 1) % roommates.length;
    printCurrentPlayer();
});

function printCurrentPlayer() {
    console.log("It's " + roommates[currentplayerIdx].name + "'s turn.");
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
}
