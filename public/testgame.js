import { updateGameView } from './rendering-module.js';
import { socket, datastore } from './index.js';


document.querySelector('#gettestgame').onclick = () => {
    socket.emit('test-game-req');
};

socket.on('test-game', testgame => {
    datastore.game = testgame;
    datastore.index = 0;
    updateGameView();

    document.querySelector('#joinsection').innerHTML = '';
    document.querySelector('#swapsection').innerHTML = '';
    document.querySelector('#gamesection').style.visibility = 'visible';
});