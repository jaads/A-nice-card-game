import { socket, setRoom} from './index.js';

let nameinput = document.querySelector('#name');
let roominput = document.querySelector('#joinroominput');
let joinroombtn = document.querySelector('#joinroombtn');
let startbtn = document.querySelector('#startbtn');
let playercount = document.querySelector('#playercount');
let currentroommates = document.querySelector('#currentroommates');

joinroombtn.onclick = () => {
    setRoom(roominput.value);
    socket.emit('join-room', {
        user: nameinput.value,
        room: roominput.value
    });
};

socket.on('full-room', () => alert("Sorry, you are too late."));

socket.on('user-joined', playersInRoom => {
    playercount.innerText = playersInRoom.length;
    showplayers(playersInRoom);
    startbtn.onclick = () => socket.emit('start-game', roominput.value);
});

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
