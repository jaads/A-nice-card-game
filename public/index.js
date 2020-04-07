let socket = io.connect('http://localhost:4000');

let nameinput = document.querySelector('#name');
let newroominput = document.querySelector('#createroominput');
let createbtn = document.querySelector('#createroombtn');

currentroommates = [];

createbtn.onclick = () => {
    socket.emit('join room',
        {
            user: nameinput.value,
            room: newroominput.value
        });

};

socket.on('new user in room', (data) => {
    console.log(data);
});

socket.on('userslist', data => {
    console.log(data);
});
