let socket = io.connect('http://localhost:4000');
let nameinput = document.querySelector('#name');
let roominput = document.querySelector('#joinroominput');
let joinroombtn = document.querySelector('#joinroombtn');
let startbtn = document.querySelector('#startbtn');
let playercount = document.querySelector('#playercount');
let pickupbtn = document.querySelector('#pickupbtn');
let notvalidalertdiv = document.querySelector('#notvalidalert');
let notyourturnalertdiv = document.querySelector('#notyourturnalert');
let gamediv = document.querySelector('#game');
let prevcarbtn = document.querySelector('#prevcardbtn');

import { isValidMove } from './card-logic.js';
import { renderCards, showAmountInput, showplayers, updateView, disableInputs, renderPrevCard} from './rendering-module.js';

export let playerQueue = [];
export let game = null;
export let playersIndex = null;
let currentlyInGame = false;

joinroombtn.onclick = () => {
    socket.emit('join-room', {
        user: nameinput.value,
        room: roominput.value
    });
};

prevcarbtn.onclick = renderPrevCard;

socket.on('full-room', () => alert("Sorry, you are too late."));

startbtn.onclick = () => {
    if (playerQueue.length > 0) {
        socket.emit('start-game', roominput.value);
    } else {
        console.log("No players yet.");
    }
};

socket.on('user-joined', playersInRoom => {
    playerQueue = playersInRoom;
    playercount.innerText = playerQueue.length;
    showplayers();
});

socket.on('game-started', gameparam => {
    console.log('The game has started.');
    disableInputs();
    game = gameparam;
    currentlyInGame = true;
    gamediv.style.visibility = 'visible';
    updateView();
});

socket.on('user-index', indexParam => {
    playersIndex = indexParam;
    renderCards(game, playersIndex);
});

socket.on('move-made', updatedGame => {
    game = updatedGame;
    renderCards(game, playersIndex);
    updateView();
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

function getCurrentCard() {
    return game.stack[game.stack.length - 1] != undefined ? game.stack[game.stack.length - 1] : 1;
};

function getPreviousCard() {
    return game.stack[game.stack.length - 2] != undefined ? game.stack[game.stack.length - 2] : 1;
};
