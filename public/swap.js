import { socket, game, setGame, setIndex, index, room } from './index.js';

let swapbtn = document.querySelector('#swapbtn');
let readybtn = document.querySelector('#readybtn');
let swapcardsfirststage = document.querySelector('#swapcardsfirststage');
let swapcardssecondstage = document.querySelector('#swapcardssecondstage');


socket.on('room-closed', (data) => {
    console.log('Room closed');
    setGame(data.game);
    setIndex(data.index);
    showSwapSection();
    renderCardsForSwapping();
});

function showSwapSection() {
    document.querySelector('#joinsection').innerHTML = '';
    document.querySelector('#swapsection').style.visibility = 'visible';
};

function renderCardsForSwapping() {
    swapcardsfirststage.innerHTML = '';
    game.cards[index].handCards.forEach(card => {
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
    game.cards[index].lastCards.forEach(card => {
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
    if (div.parentElement.id == 'swapcardsfirststage') {
        document.querySelectorAll('#swapcardsfirststage .background-secondary').forEach((elem) => {
            elem.classList.remove('background-secondary');
            elem.classList.add('background-primary');
        });
    }
    if (div.parentElement.id == 'swapcardssecondstage') {
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
    if (firstIndex != null && secondIndex != null) {
        swapCards(firstIndex, secondIndex);
        renderCardsForSwapping();
    } else {
        console.log('no cards selected..');
    }
};

function swapCards(index1, index2) {
    let tmp = game.cards[index].handCards[index1];
    game.cards[index].handCards[index1] = game.cards[index].lastCards[index2];
    game.cards[index].lastCards[index2] = tmp;
};


readybtn.onclick = () => {
    socket.emit('swap-cards', {
        room: room,
        index: index,
        newHandCards: game.cards[index].handCards,
        newLastCards: game.cards[index].lastCards
    });
    socket.emit('i-am-ready', room);
};


socket.on('wait-for-others-to-swap', () => {
    document.querySelector('#swapsection').innerHTML = '';
    let h = document.createElement('h1');
        h.classList.add('row', 'flex-center');
        let node = document.createTextNode('Wait for the others...');
        h.appendChild(node);
        document.querySelector('#swapsection').appendChild(h);    
});