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
        },
        {
            id: '2987349385',
            name: 'Karl',
            room: 'someroom'
        },
        {
            id: '390480380',
            name: 'Kati',
            room: 'someroom'
        }
    ];
    testGame = new Game('someroom', testplayers);
    testGame.deck.length = 0; // otherwise the player would get new random cards
});

describe('Current player index', () => {
    test('Inital', () => {
        expect(testGame.currentPlayerIdx).toEqual(0);
    });
    // TODO: rework test. the random card meight be a card which is not a valid move..
    test('After first move', () => {
        expect(testGame.currentPlayerIdx).toEqual(0);
        testGame.makemove([getRamdomCard()], testGame.currentPlayerIdx);
        expect(testGame.currentPlayerIdx).toEqual(1);
        testGame.makemove([getRamdomCard()], testGame.currentPlayerIdx);
        expect(testGame.currentPlayerIdx).toEqual(2);
        testGame.makemove([getRamdomCard()], testGame.currentPlayerIdx);
        expect(testGame.currentPlayerIdx).toEqual(3);
        testGame.makemove([getRamdomCard()], testGame.currentPlayerIdx);
        expect(testGame.currentPlayerIdx).toEqual(0);
    });
});

function getRamdomCard() {
    return testGame.cards[testGame.currentPlayerIdx].handCards[0];
};