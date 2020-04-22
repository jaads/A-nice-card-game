let cardsOnHandDiv = document.querySelector('#cardsonhanddiv');
let cardsOnTableDiv = document.querySelector('#cardsontablediv');
let laststagecardsdiv = document.querySelector('#laststagecardsdiv');
let currentCard = document.querySelector('#currentcard');
let prevcard = document.querySelector('#prevcard');
let NrOfCardsOnStack = document.querySelector('#NrOfCardsOnStack');
let amountOptions = document.querySelector('#amountOptions');
let decksize = document.querySelector('#decksize');
let mates = document.querySelector('#currentroommates');
let nameinput = document.querySelector('#name');
let roominput = document.querySelector('#joinroominput');
let joinroombtn = document.querySelector('#joinroombtn');

import { decideAmount, game, playersIndex, playerQueue, tryMakeAMove } from './index.js';

export function renderCards() {
    cardsOnHandDiv.innerHTML = '';
    game.cards[playersIndex].handCards.forEach(card => {
        let newdiv = document.createElement('div');
        newdiv.classList.add('margin', 'badge', 'acard');
        let node = document.createTextNode(card);
        newdiv.appendChild(node);
        cardsOnHandDiv.appendChild(newdiv);
        newdiv.onclick = () => {
            decideAmount(Number(newdiv.textContent));
        };
    });

    cardsOnTableDiv.innerHTML = '';
    game.cards[playersIndex].lastCards.forEach(card => {
        let newdiv = document.createElement('div');
        newdiv.classList.add('margin', 'badge', 'acard');
        let node = document.createTextNode(card);
        newdiv.appendChild(node);
        cardsOnTableDiv.appendChild(newdiv);
        newdiv.onclick = () => {
            decideAmount(Number(newdiv.textContent));
        };
    });

    laststagecardsdiv.innerHTML = '';
    game.cards[playersIndex].flippedCards.forEach(card => {
        let newdiv = document.createElement('div');
        newdiv.classList.add('margin', 'badge', 'acard');
        let node = document.createTextNode('?');
        newdiv.appendChild(node);
        laststagecardsdiv.appendChild(newdiv);
        newdiv.onclick = () => {
            if (game.cards[playersIndex].lastCards.length <= 0) {
                node.textContent = card;
            } else {
                console.log('You cannot see this cards yet.');
            }
        };
    });
};

export function showAmountInput(list) {
    for (let i = 0; i < list.length; i++) {
        let newdiv = document.createElement('div');
        newdiv.classList.add('margin', 'badge', 'secondary', 'amountoption');
        let node = document.createTextNode(i + 1);
        newdiv.appendChild(node);
        amountOptions.appendChild(newdiv);
        newdiv.onclick = () => {
            let desiredAmount = Number(newdiv.textContent);
            handleAmountInput(list, desiredAmount);
        }
    };
};

function handleAmountInput(possibleCards, desiredAmount) {
    let finallist = [];
    while (finallist.length < desiredAmount) {
        finallist.push(possibleCards.pop());
    }
    tryMakeAMove(finallist);
    hideAmountInput();
};

function hideAmountInput() {
    amountOptions.innerHTML = '';
};

export function disableInputs() {
    nameinput.disabled = true;
    roominput.disabled = true;
    joinroombtn.disabled = true;
};

export function updateView() {
    renderCurrentCard();
    highlightCurrentPlayer();
    updateNumberOfCardsOnStack();
};

export function showplayers() {
    mates.innerHTML = '';
    playerQueue.forEach(element => {
        let div = document.createElement("div");
        div.classList.add('badge', 'playername');
        let node = document.createTextNode(element.name);
        div.appendChild(node);
        mates.appendChild(div);
    });
};

function highlightCurrentPlayer(params) {
    mates.innerHTML = '';
    game.players.forEach((player, idx) => {
        let div = document.createElement("div");
        div.classList.add('badge', 'playername');
        if (idx == game.currentPlayerIdx) {
            div.classList.add('success');
        }
        let node = document.createTextNode(player.name);
        div.appendChild(node);
        mates.appendChild(div)
    });
};

function updateNumberOfCardsOnStack() {
    NrOfCardsOnStack.innerText = game.stack.length;
    decksize.innerText = game.deck.length;
};


function renderCurrentCard() {
    if (game.stack.length > 0) {
        currentCard.innerText = game.stack[game.stack.length - 1];
    } else {
        currentCard.innerHTML = "&empty;";
    }

    if (game.stack.length >= 2) {
        prevcard.innerText = game.stack[game.stack.length - 2];
    } else {
        prevcard.innerHTML = "&empty;";
    }
};
