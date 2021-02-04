import { socket, datastore } from './index.js';
import { showSwapSection } from './rendering/section-rendering.js';
import { showNotJoinedAlert } from './rendering/alert-rendering.js';
import { renderCardsForSwapping } from './swap.js';

let nameinput = document.querySelector('#name');
let roominput = document.querySelector('#joinroominput');
let joinroombtn = document.querySelector('#joinroombtn');
let startbtn = document.querySelector('#startbtn');
let playercount = document.querySelector('#playercount');
let currentroommates = document.querySelector('#currentroommates');


let hadJoined = false;
joinroombtn.onclick = () => {
    if (roominput.value === '' || nameinput.value === '') {
        roominput.classList.add("border-danger");
        nameinput.classList.add("border-danger");
        return;
    }
    if (hadJoined) {
        // Indicate that user cannot join more than 1 game
        console.log("Already joined a game");
        return;
    }
    hadJoined = true;
    socket.emit('join-room', {
        username: nameinput.value,
        room: roominput.value
    });
    roominput.classList.remove("border-danger");
    nameinput.classList.remove("border-danger");
};

startbtn.onclick = () => {
    if (hadJoined) {
        socket.emit('start-game', roominput.value);
    } else {
        showNotJoinedAlert();
    }
};

socket.on('cannot-join-anymore', () => alert("Sorry, you are too late."));

socket.on('user-joined', playersInRoom => {
    playercount.innerText = playersInRoom.length;
    showplayers(playersInRoom);
});

socket.on('room-closed', (data) => {
    datastore.game = data.game;
    datastore.index = data.index;
    showSwapSection();
    renderCardsForSwapping();
});

// Rendering
function showplayers(players) {
    currentroommates.innerHTML = '';
    players.forEach(element => {
        let div = document.createElement("div");
        div.classList.add('badge', 'playername');
        let node = document.createTextNode(element.name);
        div.appendChild(node);
        currentroommates.appendChild(div);
    });
};
