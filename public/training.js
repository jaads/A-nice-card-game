let prev = document.querySelector('#prev');
let current = document.querySelector('#current');
let next = document.querySelector('#next');


function find() {
    let randomPrev = Math.floor(Math.random() * 12) + 2;
    let randomCurrent = 0;

    if (randomPrev == 3) {
        randomCurrent = Math.floor(Math.random() * 12) + 2;
    } else if (randomPrev == 7) {
        randomCurrent = Math.floor(Math.random() * 6) + 2;
    } else {
        while (randomPrev > randomCurrent ) {
            randomCurrent = Math.floor(Math.random() * 12) + 2;
        }
    }

    prev.innerText = randomPrev;
    current.innerText = randomCurrent;
}

find();
