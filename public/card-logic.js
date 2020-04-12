let values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

export function getDeck() {
    let deck = []
    values.forEach((elem) => {
        for (let i = 0; i < 4; i++) {
            deck.push(elem);
        }
    });
    return shuffle(deck);;
}

// Nice in-place O(n) shuffle thanks to this post: https://bost.ocks.org/mike/shuffle/
function shuffle(array) {
    var m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

export function getSuffledDeck () {
    let deck = getDeck();
    return shuffle(deck);
}

export function isValidMove(prev, current, next) {
    if (current == 2) {
        return true;
    }
    if (current == 3) {
        if (next >= prev) {
            return true;
        }
    }
    if (current == 7) {
        if (next <= 7 && next != 10) {
            return true;
        } 
    } else {
        if (next >= current || (next == 2 || next == 3)) {
            return true;
        }
    }
    return false;
}