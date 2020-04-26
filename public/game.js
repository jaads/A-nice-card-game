import { socket } from './index.js';
import { isValidMove } from './card-logic.js';
import { showAmountInput, updateView, renderPrevCard} from './rendering-module.js';

let pickupbtn = document.querySelector('#pickupbtn');
let notvalidalertdiv = document.querySelector('#notvalidalert');
let notyourturnalertdiv = document.querySelector('#notyourturnalert');
let prevcarbtn = document.querySelector('#prevcardbtn');

let playersIndex = null;
let game = null;
let currentlyInGame = false;

socket.on('game-started', gameparam => {
    console.log('The game has started.');
    game = gameparam.game;
    playersIndex = gameparam.index;
    currentlyInGame = true;
    updateView(game, playersIndex);
    showSection();
});

function showSection() {
    document.querySelector('#gamesection').style.visibility = 'visible';
    document.querySelector('#joinsection').innerHTML = '';
};

socket.on('move-made', updatedGame => {
    game = updatedGame;
    updateView(game, playersIndex);
});

pickupbtn.onclick = () => {
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
            let cardNumber = playedCardArr[0];
            if (isValidMove(game.stack, cardNumber)) {
                socket.emit("move", { room: game.room, cards: playedCardArr });
            } else {
                notvalidalertdiv.style.display = "inline";
                setTimeout(() => notvalidalertdiv.style.display = "none", 3000);
            }
        } else {
            notyourturnalertdiv.style.display = "block";
            setTimeout(() => notyourturnalertdiv.style.display = "none", 3000);
        }
    }
}

prevcarbtn.onclick = renderPrevCard;
