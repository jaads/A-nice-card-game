let cardsOnHandDiv = document.querySelector('#cardsonhanddiv');
let cardsOnTableDiv = document.querySelector('#cardsontablediv');
let laststagecardsdiv = document.querySelector('#laststagecardsdiv');
let currentCard = document.querySelector('#currentcard');
let prevcard = document.querySelector('#prevcard');
let NrOfCardsOnStack = document.querySelector('#NrOfCardsOnStack');
let amountOptions = document.querySelector('#amountOptions');
let decksize = document.querySelector('#decksize');
let howmanycardstextpara = document.querySelector('#howmanycardstext');
let notyetalertdiv = document.querySelector('#notyetalert');
let notvalidalertdiv = document.querySelector('#notvalidalert');
let amountburnedcardsspan = document.querySelector('#amountburnedcards');
let coplayerstemplate = document.querySelector('#coplayerstemplate');
let coplayerssection = document.querySelector('#coplayers');

import { decideAmount, tryMakeAMove } from './game.js';
import { index, game } from './index.js';

export function renderCards(game, index) {
    cardsOnHandDiv.innerHTML = '';
    game.cards[index].handCards.forEach(card => {
        let newdiv = document.createElement('div');
        newdiv.classList.add('acard', 'background-primary', 'margin');
        let node = document.createTextNode(card);
        newdiv.appendChild(node);
        cardsOnHandDiv.appendChild(newdiv);
        newdiv.onclick = () => {
            decideAmount(Number(newdiv.textContent));
        };
    });

    cardsOnTableDiv.innerHTML = '';
    game.cards[index].lastCards.forEach(card => {
        let newdiv = document.createElement('div');
        newdiv.classList.add('acard', 'background-primary', 'margin');
        let node = document.createTextNode(card);
        newdiv.appendChild(node);
        cardsOnTableDiv.appendChild(newdiv);
        newdiv.onclick = () => {
            if (game.cards[index].handCards.length > 0) {
                showNotValidAlert();
            } else {
                decideAmount(Number(newdiv.textContent));
            }
        };
    });

    laststagecardsdiv.innerHTML = '';
    game.cards[index].flippedCards.forEach(card => {
        let newdiv = document.createElement('div');
        newdiv.classList.add('acard', 'background-primary', 'margin');
        let node = document.createTextNode('?');
        newdiv.appendChild(node);
        laststagecardsdiv.appendChild(newdiv);
        newdiv.onclick = () => {
            if (game.cards[index].lastCards.length > 0 || game.cards[index].lastCards.length > 0) {
                showNotYetAlert();
            } else {

                // Check if another cards has already been turned
                let anotherCardIsAlreadyturned = false;
                document.querySelectorAll('#laststagecardsdiv .acard').forEach(elem => {
                    if (elem.innerText != '?') {
                        anotherCardIsAlreadyturned = true;
                    }
                });

                if (anotherCardIsAlreadyturned) {
                    showNotYetAlert();
                } else {
                    node.textContent = card;
                    newdiv.onclick = decideAmount(Number(newdiv.textContent));
                }
            }
        };
    });
};

function showNotValidAlert() {
    notvalidalertdiv.style.display = "block";
    setTimeout(() => notvalidalertdiv.style.display = "none", 3000);
};

function showNotYetAlert() {
    notyetalertdiv.style.display = "block";
    setTimeout(() => notyetalertdiv.style.display = "none", 3000);
};

export function showAmountInput(list) {
    howmanycardstextpara.style.display = "block";
    for (let i = 0; i < list.length; i++) {
        let newdiv = document.createElement('div');
        newdiv.classList.add('margin', 'badge', 'secondary', 'amountoption');
        let node = document.createTextNode(i + 1);
        newdiv.appendChild(node);
        amountOptions.appendChild(newdiv);
        newdiv.onclick = () => {
            let desiredAmount = Number(newdiv.textContent);
            howmanycardstextpara.style.display = "none";
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
    hideAmountInput();
};

function hideAmountInput() {
    amountOptions.innerHTML = '';
};

export function updateView(game, index) {
    renderCurrentCard(game);
    renderCards(game, index);
    rendercoplayers(game);
    updateNumberOfCardsOnStack(game);
};

export function rendercoplayers(game) {
    coplayerssection.innerHTML = '';
    game.players.forEach((player, idx) => {
        const template = coplayerstemplate.content.cloneNode(true);
        if (idx == game.currentPlayerIdx) {
            template.querySelector('#coplayer').classList.add('background-success');
        }
        template.querySelector('#coplayername').innerText = player.name;
        game.cards[idx].lastCards.forEach((card) => {
            let newdiv = document.createElement('span');
            newdiv.classList.add('opponentCard', 'background-primary', 'margin-small', 'border', 'shadow');
            let node = document.createTextNode(card);
            newdiv.appendChild(node);
            template.querySelector('#coplayercards').appendChild(newdiv);
        });
        template.querySelector('#coplayernrcardsleft').innerText = game.cards[idx].handCards.length;
        coplayerssection.appendChild(template);
    });
};

function updateNumberOfCardsOnStack(game) {
    NrOfCardsOnStack.innerText = game.stack.length;
    decksize.innerText = game.deck.length;
    amountburnedcardsspan.innerText = game.outOfGameCards.length;
};


function renderCurrentCard(game) {
    if (game.stack.length > 0) {
        currentCard.innerText = game.stack[game.stack.length - 1];
    } else {
        currentCard.innerHTML = "&empty;";
    }
};

export function renderPrevCard() {
    if (game.stack.length >= 2) {
        prevcard.innerText = game.stack[game.stack.length - 2];
    } else {
        prevcard.innerHTML = "&empty;";
    }
};

export function showWinner() {
    document.querySelector('body header').innerHTML = '';
    document.querySelector('body main').innerHTML = '';
    let body = document.querySelector('body');

    let d = document.createElement('div');
    d.setAttribute('id', 'winnertext');
    d.classList.add('row', 'flex-center');
    let winnersname = null;
    if (game.winnersIndex == index) {
        winnersname = "You";
        body.classList.add('background-success');
    } else {
        winnersname = game.players[game.currentPlayerIdx].name;
        body.classList.add('background-warning');
    }
    let winnertextnode = document.createTextNode(winnersname.toUpperCase() + " WON");
    d.appendChild(winnertextnode);
    body.appendChild(d);
};