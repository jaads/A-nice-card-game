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
    },
    {
        id: '2938749823',
        name: 'Alan',
        room: 'someroom'
    }
];

function setUp() {
    return new Game('someroom', testplayers)
};

function testnextplayer(stack, expected) {
    let testgame = setUp();
    stack.forEach(cards => {
        testgame.makemove(cards, testgame.currentPlayerIdx);
    });

    let actual = testgame.currentPlayerIdx; 
    if (actual === expected) {
        console.log('\x1b[32m%s\x1b[0m', 'PASSED');        
    } else {
        console.log('\x1b[31m%s\x1b[0m', 'FAILED', 'expected: ', expected, ' but got', actual);
    }
};

testnextplayer([[8]], 2);
testnextplayer([[8], [3]], 4);
testnextplayer([[8], [3], [3]], 1);
testnextplayer([[8], [3], [3], [3]], 3);
