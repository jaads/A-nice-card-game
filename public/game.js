import { socket, setGame, index, game } from './index.js';
import { isValidMove } from './card-logic.js';
import { showAmountInput, updateView, showPrevCards } from './rendering-module.js';
import { showGameSection } from './section-rendering.js';

let pickupbtn = document.querySelector('#pickupbtn');
let notvalidalertdiv = document.querySelector('#notvalidalert');
let notyourturnalertdiv = document.querySelector('#notyourturnalert');
let prevcarbtn = document.querySelector('#prevcardbtn');

socket.on('all-ready', updatedgame => {
    setGame(updatedgame);
    updateView();
    showGameSection();
});

socket.on('move-made', updatedGame => {
    setGame(updatedGame);
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
    if (game.currentPlayerIdx == index) {
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
};

export function faceUpCard(idxparam) {
    socket.emit('face-up', { room: game.room, flippedCardsIdx: idxparam });
};

prevcarbtn.onclick = showPrevCards;
