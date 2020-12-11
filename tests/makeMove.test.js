const Game = require('../gamemodel.js');

let testGame = null;

beforeEach(() => {
    const testplayers = [
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
    testGame = new Game('someroom', testplayers);
});


test('New game', () => {
    expect(testGame).toEqual(expect.anything());
});

test('First move', () => {
    setCards(testGame, [14, 3], [3, 6, 11], [4, 8, 12]);
    testGame.makemove([14], 0);
    expect(testGame.cards[0].handCards).toEqual([3]);
});


function setCards(game, s1Cards, s2Cards, s3Cards) {
    game.deck.length = 0;
    game.cards[0].handCards = s1Cards;
    game.cards[0].lastCards = s2Cards;
    game.cards[0].flippedCards = s3Cards;
}