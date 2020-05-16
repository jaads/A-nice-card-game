const Game = require('../gamemodel.js');

let testplayers = [
    {
        id: '28378929812',
        name: 'John',
        room: 'someroom'
    },
    {
        id: '98723462233',
        name: 'Radon',
        room: 'someroom'
    }
];

function setUp() {
    return new Game('someroom', testplayers)
};

function testMove(s1Cards, s2Cards, s3Cards, playedCards, expecteds1, expecteds2, expecteds3) {

    let tg = setUp();
    tg.deck.length = 0;
    tg.cards[0].handCards = s1Cards;
    tg.cards[0].lastCards = s2Cards;
    tg.cards[0].flippedCards = s3Cards;
    tg.makemove(playedCards, 0);

    if (areEqual(tg.cards[0].handCards, expecteds1) && areEqual(tg.cards[0].lastCards, expecteds2) && areEqual(tg.cards[0].flippedCards, expecteds3)) {
        console.log('\x1b[32m%s\x1b[0m', 'PASSED');
    } else if (!areEqual(tg.cards[0].handCards, expecteds1)) {
        console.log('\x1b[31m%s\x1b[0m', 'FAILED', 'expected handcards: ', expecteds1, ' but got', tg.cards[0].handCards);
    } else if (!areEqual(tg.cards[0].lastCards, expecteds2)) {
        console.log('\x1b[31m%s\x1b[0m', 'FAILED', 'expected last cards: ', expecteds2, ' but got', tg.cards[0].lastCards);
    } else if (!areEqual(tg.cards[0].flippedCards, expecteds3)) {
        console.log('\x1b[31m%s\x1b[0m', 'FAILED', 'expected flipped cards: ', expecteds3, ' but got', tg.cards[0].flippedCards);
    }
};

function areEqual(first, second) {
    return JSON.stringify(first) == JSON.stringify(second);
};

testMove([14, 3], [3, 6, 11], [4, 8, 12], [3, 3], [14], [6, 11], [4, 8, 12]);
testMove([14], [3, 6, 11], [4, 8, 12], [14], [], [3, 6, 11], [4, 8, 12]);
testMove([], [11], [4, 8, 12], [1], [], [11], [4, 8, 12]);
testMove([], [11], [4, 8, 12], [1], [], [11], [4, 8, 12]);
testMove([], [], [9], [9], [], [], []);