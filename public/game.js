import { socket, setGame, index, game } from './index.js';
import { isValidMove } from './card-logic.js';
import { showAmountInput, updateView, showPrevCards, indicateCardsGotBurned } from './rendering-module.js';
import { showGameSection, showPlayerLeftSection } from './section-rendering.js';
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

export function handleFirstStageClick() {
    let desiredCard = Number(this.textContent);
    if (isPlayersTurn()) {
        decideAmount(desiredCard);
    } else if (canStill(desiredCard)) {
        makeBelatedMove(desiredCard);
    } else {
        showNotYourTurnAlert();
    }
};

export function handleSecondStageClick() {
    if (isPlayersTurn() || canStill()) {
        if (game.cards[index].handCards.length > 0) {
            showNotValidAlert();
        } else {
            decideAmount(Number(newdiv.textContent));
        }
    } else {
        showNotYourTurnAlert();
    }
};

function isPlayersTurn() {
    return game.currentPlayerIdx == index;
};

function canStill(card) {
    let wasOneBefore = game.currentPlayerIdx - index == 1 ? true : false;
    let isTheSame = card == game.stack[game.stack.length - 1];
    return wasOneBefore && isTheSame;
};

function decideAmount(playedCard) {
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

socket.on('coplayer-disconnected', () => showPlayerLeftSection());
