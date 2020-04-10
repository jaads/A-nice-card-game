let socket = io.connect('http://localhost:4000');
let mates = document.querySelector('#currentroommates');
let nameinput = document.querySelector('#name');
let newroominput = document.querySelector('#createroominput');
let createbtn = document.querySelector('#createroombtn');
let startbtn = document.querySelector('#startbtn');

currentroommates = [];
notavailablerooms = [];

createbtn.onclick = () => {
    if (!notavailablerooms.includes(newroominput.value)) {
        socket.emit('join room',
        {
            user: nameinput.value,
            room: newroominput.value
        });
    } 

};

startbtn.onclick = () => {
    socket.emit('start', newroominput.value );
};

socket.on('game_started', (roomName) => {
    notavailablerooms.push(roomName);
});

socket.on('new user in room', (data) => {
    currentroommates = data;
    console.log(currentroommates);
    showplayers();
});

function showplayers() {
    mates.innerHTML = '';
    currentroommates.forEach(element => {
        let para = document.createElement("p");
        let node = document.createTextNode(element.name);
        para.appendChild(node);
        mates.appendChild(para)
    });
}


