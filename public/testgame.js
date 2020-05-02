import { showAmountInput, updateView, renderPrevCard } from './rendering-module.js';
import { socket, setGame, index, game, setIndex } from './index.js';


document.querySelector('#gettestgame').onclick = function () {
    socket.emit('test-game-req');
};

socket.on('test-game', testgame => {
    setGame(testgame);
    setIndex(0);
    updateView(game, index);

    document.querySelector('#joinsection').innerHTML = '';
    document.querySelector('#swapsection').innerHTML = '';
    document.querySelector('#gamesection').style.visibility = 'visible';
});