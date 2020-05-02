import { socket, setGame, index, game } from './index.js';
import { isValidMove } from './card-logic.js';
import { showAmountInput, updateView, showPrevCards } from './rendering-module.js';
import { showGameSection } from './section-rendering.js';
import { showNotYourTurnAlert, showNotValidAlert } from './alert-rendering.js';


socket.on('all-ready', updatedgame => {
    setGame(updatedgame);
    updateView();
    showGameSection();
});

socket.on('move-made', updatedGame => {
    setGame(updatedGame);
    updateView();
});

document.querySelector('#prevcardbtn').onclick = showPrevCards;

document.querySelector('#pickupbtn').onclick = () => {
    if (game.currentPlayerIdx == index) {
        socket.emit('pick-up', game.room);
    } else {
        showNotYourTurnAlert();
    }
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
            showNotValidAlert();
        }
    } else {
        showNotYourTurnAlert();
    }
};

export function faceUpCard(idxparam) {
    if (game.currentPlayerIdx == index) {
        socket.emit('face-up', { room: game.room, flippedCardsIdx: idxparam });
    } else {
        showNotYourTurnAlert();
    }
};
