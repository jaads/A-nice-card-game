import { socket, setGame, index, game } from './index.js';
import { isValidMove } from './card-logic.js';
import { showAmountInput, updateView, showPrevCards, indicateCardsGotBurned } from './rendering-module.js';
import { showGameSection } from './section-rendering.js';
import { showNotYourTurnAlert, showNotValidAlert } from './alert-rendering.js';


socket.on('all-ready', updatedgame => {
    setGame(updatedgame);
    updateView();
    showGameSection();
});

socket.on('move-made', updatedGame => {
    if (game.outOfGameCards.length < updatedGame.outOfGameCards.length) {
        indicateCardsGotBurned();
    }
    setGame(updatedGame);
    updateView();
});

document.querySelector('#prevcardbtn').onclick = showPrevCards;

document.querySelector('#pickupbtn').onclick = () => {
    if (game.currentPlayerIdx == index) {
        if (game.stack.length > 0) {
            socket.emit('pick-up', game.room);
        } else {
            showNotValidAlert();
        }
    } else {
        showNotYourTurnAlert();
    }
};

export function decideAmount(playedCard) {
    let hand = game.cards[game.currentPlayerIdx].handCards.filter((card) => card == playedCard);
    let last = game.cards[game.currentPlayerIdx].lastCards.filter((card) => card == playedCard);
    if (hand.length > 1) {
        showAmountInput(hand);
    } else if (game.cards[index].handCards == 0 && last.length > 1) {
        showAmountInput(last);
    } else {
        tryMakeAMove([playedCard]);
    }
};

export function tryMakeAMove(playedCardArr) {
    let cardNumber = playedCardArr[0];
    if (isValidMove(game.stack, cardNumber)) {
        socket.emit("move", { room: game.room, cards: playedCardArr, belated: false });
    } else {
        showNotValidAlert();
    }
};

export function makeBelatedMove(playedCard) {
    socket.emit("move", { room: game.room, cards: [playedCard], belated: true });
};

export function faceUpCard(idxparam) {
    socket.emit('face-up', { room: game.room, player: index, flippedCardsIdx: idxparam });
};
