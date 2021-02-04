import { socket, datastore } from './index.js';
import { isValidMove } from './card-logic.js';
import * as gameRenderer from './rendering/game-rendering.js';
import { showPlayerLeftSection } from './rendering/section-rendering.js';
import { showNotYourTurnAlert, showNotValidAlert } from './rendering/alert-rendering.js';


socket.on('move-made', updatedGame => {
    if (datastore.game.outOfGameCards.length < updatedGame.outOfGameCards.length) {
        gameRenderer.indicateCardsGotBurned();
    }
    datastore.game = updatedGame;
    gameRenderer.updateGameView();
});

document.querySelector('#prevcardbtn').onclick = gameRenderer.showPrevCards;

document.querySelector('#pickupbtn').onclick = () => {
    if (datastore.game.currentPlayerIdx === datastore.index) {
        if (datastore.game.stack.length > 0) {
            socket.emit('pick-up', datastore.game.room);
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
    let desiredCard = Number(this.textContent);
    if (isPlayersTurn() || canStill()) {
        if (datastore.game.cards[datastore.index].handCards.length > 0) {
            showNotValidAlert();
        } else {
            decideAmount(desiredCard);
        }
    } else {
        showNotYourTurnAlert();
    }
};

function isPlayersTurn() {
    return datastore.game.currentPlayerIdx === datastore.index;
};

function canStill(card) {
    let wasOneBefore = datastore.game.currentPlayerIdx - datastore.index === 1 ? true : false;
    let isTheSame = card === datastore.game.stack[datastore.game.stack.length - 1];
    return wasOneBefore && isTheSame;
};

function decideAmount(playedCard) {
    const playersCards = datastore.game.cards[datastore.game.currentPlayerIdx];
    let hand = playersCards.handCards.filter((card) => card === playedCard);
    let last = playersCards.lastCards.filter((card) => card === playedCard);
    if (hand.length > 1) {
        gameRenderer.showAmountInput(hand);
    } else if (datastore.game.cards[datastore.index].handCards === 0 && last.length > 1) {
        gameRenderer.showAmountInput(last);
    } else {
        tryMakeAMove([playedCard]);
    }
};

export function tryMakeAMove(playedCardArr) {
    let cardNumber = playedCardArr[0];
    if (isValidMove(datastore.game.stack, cardNumber)) {
        socket.emit("move", {
            room: datastore.game.room,
            cards: playedCardArr,
            belated: false
        });
    } else {
        showNotValidAlert();
    }
    gameRenderer.clearAmountInput();
};

export function makeBelatedMove(playedCard) {
    socket.emit("move", {
        room: datastore.game.room,
        cards: [playedCard],
        belated: true
    });
};

export function faceUpCard(idxparam) {
    socket.emit('face-up', {
        room: datastore.game.room,
        player: datastore.index,
        flippedCardsIdx: idxparam
    });
};

socket.on('coplayer-disconnected', () => showPlayerLeftSection());
