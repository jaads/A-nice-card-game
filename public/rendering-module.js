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
let howmanycardstextpara = document.querySelector('#howmanycardstext');
let notyetalertdiv = document.querySelector('#notyetalert');
let notvalidalertdiv = document.querySelector('#notvalidalert');
let amountburnedcardsspan = document.querySelector('#amountburnedcards');
let coplayerstemplate = document.querySelector('#coplayerstemplate');
let coplayerssection = document.querySelector('#coplayers');

import { decideAmount, game, playersIndex, playerQueue, tryMakeAMove } from './index.js';

export function renderCards() {
    cardsOnHandDiv.innerHTML = '';
    game.cards[playersIndex].handCards.forEach(card => {
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
    game.cards[playersIndex].lastCards.forEach(card => {
        let newdiv = document.createElement('div');
        newdiv.classList.add('acard', 'background-primary', 'margin');
        let node = document.createTextNode(card);
        newdiv.appendChild(node);
        cardsOnTableDiv.appendChild(newdiv);
        newdiv.onclick = () => {
            if (game.cards[playersIndex].handCards.length > 0) {
                notvalidalertdiv.style.display = "block";
                setTimeout(() => notvalidalertdiv.style.display = "none", 3000);
            } else {
                decideAmount(Number(newdiv.textContent));
            }
        };
    });

    laststagecardsdiv.innerHTML = '';
    game.cards[playersIndex].flippedCards.forEach(card => {
        let newdiv = document.createElement('div');
        newdiv.classList.add('acard', 'background-primary', 'margin');
        let node = document.createTextNode('?');
        newdiv.appendChild(node);
        laststagecardsdiv.appendChild(newdiv);
        newdiv.onclick = () => {
            if (game.cards[playersIndex].lastCards.length > 0) {
                notyetalertdiv.style.display = "block";
                setTimeout(() => notyetalertdiv.style.display = "none", 3000);
            } else {
                node.textContent = card;
            }
        };
    });
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

export function disableInputs() {
    nameinput.disabled = true;
    roominput.disabled = true;
    joinroombtn.disabled = true;
    startbtn.style.visibility = "hidden";
    mates.innerHTML = '';
    document.querySelector('#playersamout').innerHTML = '';
};

export function updateView() {
    renderCurrentCard();
    renderCards(game, playersIndex);
    rendercoplayers();
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

export function rendercoplayers() {
    coplayerssection.innerHTML = '';
    game.players.forEach((player, idx) => {
        const template = coplayerstemplate.content.cloneNode(true);
        if (idx == game.currentPlayerIdx) {
            template.querySelector('#coplayer').classList.add('background-success');
        }
        template.querySelector('#coplayername').innerText = player.name;
        game.cards[idx].lastCards.forEach((card)=> {
            let newdiv = document.createElement('span');
            newdiv.classList.add('opponentCard', 'background-primary', 'margin-small', 'border', 'shadow');
            let node = document.createTextNode(card);
            newdiv.appendChild(node);
            template.querySelector('#coplayercards').appendChild(newdiv);
        });
        template.querySelector('#coplayernrcardsleft').innerText = game.cards[idx].lastCards.length;
        coplayerssection.appendChild(template);
    });
};

function updateNumberOfCardsOnStack() {
    NrOfCardsOnStack.innerText = game.stack.length;
    decksize.innerText = game.deck.length;
    amountburnedcardsspan.innerText = game.outOfGameCards.length;
};


function renderCurrentCard() {
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
