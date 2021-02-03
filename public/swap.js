import { socket, datastore } from './index.js';
import { showSwapSection } from './section-rendering.js';

let swapbtn = document.querySelector('#swapbtn');
let readybtn = document.querySelector('#readybtn');
let swapcardsfirststage = document.querySelector('#swapcardsfirststage');
let swapcardssecondstage = document.querySelector('#swapcardssecondstage');

socket.on('room-closed', (data) => {
    datastore.game = data.game;
    datastore.index = data.index;
    showSwapSection();
    renderCardsForSwapping();
});

function renderCardsForSwapping() {
    swapcardsfirststage.innerHTML = '';
    datastore.game.cards[datastore.index].handCards.forEach(card => {
        let newdiv = document.createElement('div');
        newdiv.classList.add('acard', 'background-primary', 'margin');
        let node = document.createTextNode(card);
        newdiv.appendChild(node);
        swapcardsfirststage.appendChild(newdiv);
        newdiv.onclick = () => {
            selectForSwap(newdiv);
        };
    });
    swapcardssecondstage.innerHTML = '';
    datastore.game.cards[datastore.index].lastCards.forEach(card => {
        let newdiv = document.createElement('div');
        newdiv.classList.add('acard', 'background-primary', 'margin');
        let node = document.createTextNode(card);
        newdiv.appendChild(node);
        swapcardssecondstage.appendChild(newdiv);
        newdiv.onclick = () => {
            selectForSwap(newdiv);
        };
    });
};

function selectForSwap(div) {
    if (div.parentElement.id === 'swapcardsfirststage') {
        document.querySelectorAll('#swapcardsfirststage .background-secondary').forEach((elem) => {
            elem.classList.remove('background-secondary');
            elem.classList.add('background-primary');
        });
    }
    if (div.parentElement.id === 'swapcardssecondstage') {
        document.querySelectorAll('#swapcardssecondstage .background-secondary').forEach((elem) => {
            elem.classList.remove('background-secondary');
            elem.classList.add('background-primary');
        });
    }
    div.classList.add('background-secondary');
    div.classList.remove('background-primary');
};

swapbtn.onclick = () => {
    // Determine selected card of first row
    let firstIndex = null;
    document.querySelectorAll('#swapcardsfirststage .acard').forEach((elem, idx) => {
        if (elem.classList.contains('background-secondary')) {
            firstIndex = idx;
        }
    });
    // Determine selected card of second row
    let secondIndex = null;
    document.querySelectorAll('#swapcardssecondstage .acard').forEach((elem, idx) => {
        if (elem.classList.contains('background-secondary')) {
            secondIndex = idx;
        }
    });
    if (firstIndex !== null && secondIndex !== null) {
        swapCards(firstIndex, secondIndex);
        renderCardsForSwapping();
    } else {
        console.log('no cards selected..');
    }
};

function swapCards(index1, index2) {
    let tmp = datastore.game.cards[datastore.index].handCards[index1];
    datastore.game.cards[datastore.index].handCards[index1] = datastore.game.cards[datastore.index].lastCards[index2];
    datastore.game.cards[datastore.index].lastCards[index2] = tmp;
};

readybtn.onclick = () => {
    socket.emit('swap-cards', {
        room: datastore.room,
        index: datastore.index,
        newHandCards: datastore.game.cards[datastore.index].handCards,
        newLastCards: datastore.game.cards[datastore.index].lastCards
    });
    socket.emit('i-am-ready', datastore.room);
};

socket.on('wait-for-others-to-swap', () => {
    document.querySelector('#swapsection').innerHTML = '';
    let h = document.createElement('h1');
    h.classList.add('row', 'flex-center');
    let node = document.createTextNode('Wait for the others...');
    h.appendChild(node);
    document.querySelector('#swapsection').appendChild(h);
});