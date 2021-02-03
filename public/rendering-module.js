let cardsOnHandDiv = document.querySelector('#cardsonhanddiv');
let cardsOnTableDiv = document.querySelector('#cardsontablediv');
let laststagecardsdiv = document.querySelector('#laststagecardsdiv');
let currentCard = document.querySelector('#currentcard');
let prevcard = document.querySelector('#prevcard');
let NrOfCardsOnStack = document.querySelector('#NrOfCardsOnStack');
let amountOptions = document.querySelector('#amountOptions');
let decksize = document.querySelector('#decksize');
let howmanycardstextpara = document.querySelector('#howmanycardstext');
let amountburnedcardsspan = document.querySelector('#amountburnedcards');
let coplayerstemplate = document.querySelector('#coplayerstemplate');
let coplayerssection = document.querySelector('#coplayers');
let stackRect = document.querySelector('#stacketc');

import { tryMakeAMove, handleFirstStageClick, handleSecondStageClick, faceUpCard } from './game.js';
import { datastore } from './index.js';
import { showNotValidAlert, showNotYetAlert } from './alert-rendering.js';

export function renderCards() {
    cardsOnHandDiv.innerHTML = '';
    datastore.game.cards[datastore.index].handCards.forEach(card => {
        let newdiv = document.createElement('div');
        newdiv.classList.add('acard', 'background-primary', 'margin');
        let node = document.createTextNode(card);
        newdiv.appendChild(node);
        cardsOnHandDiv.appendChild(newdiv);
        newdiv.onclick = handleFirstStageClick;
    });

    cardsOnTableDiv.innerHTML = '';
    datastore.game.cards[datastore.index].lastCards.forEach(card => {
        let newdiv = document.createElement('div');
        newdiv.classList.add('acard', 'background-primary', 'margin');
        let node = document.createTextNode(card);
        newdiv.appendChild(node);
        cardsOnTableDiv.appendChild(newdiv);
        newdiv.onclick = handleSecondStageClick;
    });

    laststagecardsdiv.innerHTML = '';
    datastore.game.cards[datastore.index].flippedCards.forEach((card, idx) => {
        let newdiv = document.createElement('div');
        newdiv.classList.add('acard', 'background-primary', 'margin');
        let node = document.createTextNode('?');
        newdiv.appendChild(node);
        laststagecardsdiv.appendChild(newdiv);
        newdiv.onclick = () => {
            if (datastore.game.cards[datastore.index].handCards.length > 0 || datastore.game.cards[datastore.index].lastCards.length > 0) {
                showNotValidAlert();
            } else {
                let anotherCardIsAlreadyturned = false;
                document.querySelectorAll('#laststagecardsdiv .acard').forEach(elem => {
                    if (elem.innerText !== '?') {
                        anotherCardIsAlreadyturned = true;
                    }
                });
                if (anotherCardIsAlreadyturned) {
                    showNotYetAlert();
                } else {
                    faceUpCard(idx);
                }
            }
        };
    });
};

export function showAmountInput(list) {
    clearAmountInput();
    howmanycardstextpara.style.display = "block";
    for (let i = 0; i < list.length; i++) {
        let newdiv = document.createElement('div');
        newdiv.classList.add('margin', 'badge', 'secondary', 'amountoption');
        let node = document.createTextNode(i + 1);
        newdiv.appendChild(node);
        amountOptions.appendChild(newdiv);
        newdiv.onclick = () => {
            let desiredAmount = Number(newdiv.textContent);
            handleAmountInput(list, desiredAmount);
        };
    };
};

function handleAmountInput(possibleCards, desiredAmount) {
    let finallist = [];
    while (finallist.length < desiredAmount) {
        finallist.push(possibleCards.pop());
    }
    tryMakeAMove(finallist);
    clearAmountInput();
};

export function clearAmountInput() {
    howmanycardstextpara.style.display = "none";
    amountOptions.innerHTML = '';
};

export function updateView() {
    if (!datastore.game.isOver) {
        renderCurrentCard();
        renderCards();
        rendercoplayers();
        updateNumberOfCardsOnStack();
        updateBackground();
        prevcard.innerText = '';
    } else {
        showWinner();
    }
};

export function rendercoplayers() {
    coplayerssection.innerHTML = '';
    datastore.game.players.forEach((player, idx) => {
        const template = coplayerstemplate.content.cloneNode(true);
        if (idx !== datastore.index) {
            template.querySelector('#coplayername').innerText = player.name;
            if (idx === datastore.game.currentPlayerIdx) {
                template.querySelector('#coplayer').classList.add('background-success');
            }
            datastore.game.cards[idx].lastCards.forEach(card => {
                let newdiv = document.createElement('span');
                newdiv.classList.add('opponentCard', 'background-primary', 'margin-small', 'border', 'shadow');
                let node = document.createTextNode(card);
                newdiv.appendChild(node);
                template.querySelector('#coplayercards').appendChild(newdiv);
            });
            template.querySelector('#coplayernrcardsleft').innerText = datastore.game.cards[idx].handCards.length;
            coplayerssection.appendChild(template);
        }
    });
};

function updateNumberOfCardsOnStack() {
    NrOfCardsOnStack.innerText = datastore.game.stack.length;
    decksize.innerText = datastore.game.deck.length;
    amountburnedcardsspan.innerText = datastore.game.outOfGameCards.length;
};


function renderCurrentCard() {
    if (datastore.game.stack.length > 0) {
        currentCard.innerText = datastore.game.stack[datastore.game.stack.length - 1];
    } else {
        currentCard.innerHTML = "&empty;";
    }
};

function updateBackground() {
    if (datastore.game.currentPlayerIdx === datastore.index) {
        currentCard.classList.add('background-success');
    } else {
        currentCard.classList.remove('background-success');
    }
};

export function showPrevCards() {
    if (datastore.game.stack.length >= 2) {
        for (let i = 5; i > 1; i--) {
            let aprevCard = datastore.game.stack[datastore.game.stack.length - i];
            if (aprevCard !== undefined) {
                prevcard.innerText += ' ' + aprevCard + ',';
            }
        }
    } else {
        prevcard.innerHTML = "&empty;";
    }
};

export function showWinner() {
    document.querySelector('body header').innerHTML = '';
    document.querySelector('body main').innerHTML = '';
    let body = document.querySelector('body');

    let canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'confetti-canvas');
    canvas.setAttribute('style', 'top: 0');
    body.appendChild(canvas);

    let d = document.createElement('div');
    d.setAttribute('id', 'winnertext');
    d.classList.add('row', 'flex-center');
    let winnersname = null;
    if (datastore.game.winnersIndex === datastore.index) {
        winnersname = "You";
        body.classList.add('background-success');
        var confettiSettings = { "target": "confetti-canvas", "max": "90", "size": "3", "animate": true, "props": ["circle", "square", "triangle", "line"], "colors": [[165, 104, 246], [230, 61, 135], [0, 199, 228], [253, 214, 126]], "clock": "60", "rotate": false, "width": "2560", "height": "1342", "start_from_edge": false, "respawn": true }
        var confetti = new ConfettiGenerator(confettiSettings);
        confetti.render();
    } else {
        winnersname = datastore.game.players[datastore.game.currentPlayerIdx].name;
        body.classList.add('background-warning');
    }
    let winnertextnode = document.createTextNode(winnersname.toUpperCase() + " WON");
    d.appendChild(winnertextnode);
    body.appendChild(d);
};

export function indicateCardsGotBurned() {
    stackRect.classList.add('background-warning');
    setTimeout(() => {
        stackRect.classList.remove('background-warning');
    }, 2000);
};
