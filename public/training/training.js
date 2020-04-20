import { isValidMove, getNumberMapping } from '../card-logic.js';

let prev = document.querySelector('#prev');
let current = document.querySelector('#current');
let next = document.querySelector('#next');
let refreshbtn = document.querySelector('#refreshbtn');
let testinput = document.querySelector('#testinput');

testinput.focus();

function find() {
    let randomPrev = Math.floor(Math.random() * 12) + 2;
    while (randomPrev == 10) {
        randomPrev = Math.floor(Math.random() * 12) + 2;
    }
    let randomCurrent = 0;

    if (randomPrev == 3) {
        randomCurrent = Math.floor(Math.random() * 12) + 2;
    } else if (randomPrev == 7) {
        randomCurrent = Math.floor(Math.random() * 6) + 2;
    } else {
        while (randomPrev > randomCurrent || randomCurrent == 10) {
            randomCurrent = Math.floor(Math.random() * 12) + 2;
        }
    }

    prev.innerText = randomPrev;
    current.innerText = randomCurrent;
}

find();

refreshbtn.onclick = () => {
    find();
    testinput.disabled = false;
};


testinput.onkeyup = (e) => {
    testinput.disabled = true;
    let input = isNaN(e.key) ? getNumberMapping(e.key) : e.key;
    let valid = isValidMove(prev.innerText, current.innerText, input);
    next.innerText = input;
    if (valid) {
        next.classList.add("success");
    } else {
        next.classList.add("danger");
    }

    setTimeout(reset, 2000)
};

function reset() {
    find();

    testinput.disabled = false;
    testinput.value = '';
    next.innerText = '?';
    next.classList.remove("success");
    next.classList.remove("danger");
}
