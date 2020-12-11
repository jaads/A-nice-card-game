const Game = require('../../gamemodel.js');

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
    testGame.deck.length = 0; // otherwise the player would get new random cards
});


test('Game creation', () => {
    expect(testGame).toEqual(expect.anything());
});

describe('Complete move procedure', () => {
    test('Play one move', () => {
        testGame.cards[0].handCards = [14, 3];
        testGame.makemove([14], 0);
        expect(testGame.cards[0].handCards).toEqual([3]);
    });
    test('Play two cards at once', () => {
        testGame.cards[0].handCards = [14, 14, 4];
        testGame.makemove([14, 14], 0);
        expect(testGame.cards[0].handCards).toEqual([4]);
    });
    test('Play last hand card', () => {
        testGame.cards[0].handCards = [5];
        testGame.makemove([5], 0);
        expect(testGame.cards[0].handCards).toEqual([]);
    });
    test('Play a card from last stage', () => {
        testGame.cards[0].handCards = [];
        testGame.cards[0].lastCards = [5,5];
        testGame.makemove([5,5], 0);
        expect(testGame.cards[0].handCards).toEqual([]);
        expect(testGame.cards[0].lastCards).toEqual([]);
    });
    test('Play very last card', () => {
        testGame.cards[0].handCards = [];
        testGame.cards[0].lastCards = [];
        testGame.cards[0].flippedCards = [3];
        testGame.makemove([3], 0);
        expect(testGame.cards[0].handCards).toEqual([]);
        expect(testGame.cards[0].lastCards).toEqual([]);
        expect(testGame.cards[0].flippedCards).toEqual([]);
        expect(testGame.isOver).toEqual(true);
        expect(testGame.winnersIndex).toEqual(0);
    });
});

// describe('Complete move procedure', () => {
//     test('Normal move', () => {
//         testGame.cards[0].handCards = [14, 3];
//         testGame.makemove([14], 0);
//         expect(Game.transferCards()).toEqual([3]);
//     });
// });


