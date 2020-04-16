import { getDeck } from './card-logic.js';

let socket = io.connect('http://localhost:4000');
let mates = document.querySelector('#currentroommates');
let nameinput = document.querySelector('#name');
let newroominput = document.querySelector('#createroominput');
let createbtn = document.querySelector('#createroombtn');
let startbtn = document.querySelector('#startbtn');
let makemovebtn = document.querySelector('#makemovebtn');
let playercount = document.querySelector('#playercount');

let roommates = [];
let notavailablerooms = [];
let currentplayerIdx = 0;

createbtn.onclick = () => {
    let notjoinable = notavailablerooms.includes(newroominput.value);
    if (notjoinable) {
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

socket.on('game-started', (gamestate) => {
    currentplayerIdx = gamestate.currPlayerIdx;
    console.log('The game has started.');
    printCurrentPlayer();
});

makemovebtn.onclick = () => {
    let move = {
        room: newroominput.value,
        currentIdx: currentplayerIdx
    };
    socket.emit('make_move', move);
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
