class Game {

    constructor(room, players) {
        this.room = room;
        this.deck = getSuffledDeck();
        this.players = players;
        this.currentPlayerIdx = 0;
        this.cards = handOutCards(this.deck, this.players);
        this.outOfGameCards = [];
        this.stack = [];
        this.nrOfReadyPlayers = 0;
        this.isOver = false;
        this.winnersIndex = null;
    };

    getCardFromDeck() {
        return this.deck.pop();
    };

    getIndexOfPrevPlayer() {
        return (this.currentPlayerIdx - 1) % this.players.length;
    };

    makemove(playedCards, i) {
        this.transferCards(playedCards, i);
        this.getNewCards(i);
        this.sortHandCards(i);

        if (this.isFinished(i)) {
            this.makeAWinner(i);
        } else if (playedCards[0] === 10 || this.fourInARow(playedCards)) {
            this.burnStack();
        } else {
            if (i === this.currentPlayerIdx) {
                this.setNextPlayer();
            }
        }
    };

    transferCards(playedCards, i) {
        const handCards = this.cards[i].handCards;
        const lastCards = this.cards[i].lastCards;
        const flippedCards = this.cards[i].flippedCards;

        playedCards.forEach(card => {
            // Remove card from player
            if (handCards.indexOf(card) !== -1) {
                handCards.splice(handCards.indexOf(card), 1);
            } else if (lastCards.indexOf(card) !== -1) {
                lastCards.splice(lastCards.indexOf(card), 1);
            } else if (flippedCards.indexOf(card) !== -1) {
                flippedCards.splice(flippedCards.indexOf(card), 1);
            }
            // Add card to stack in the middle
            this.stack.push(card);
        });
    };

    getNewCards(desiredIndex) {
        while (this.deck.length > 0 && this.cards[desiredIndex].handCards.length < 3) {
            this.cards[desiredIndex].handCards.push(this.getCardFromDeck());
        }
    };

    isFinished(i) {
        return this.cards[i].handCards.length === 0
            && this.cards[i].lastCards.length === 0
            && this.cards[i].flippedCards.length === 0;
    };

    fourInARow(playedCards) {
        let alltogether = playedCards.length === 4;
        let successively = false;
        let end = this.stack.length;
        if (playedCards[0] === this.stack[end - 1] &&
            playedCards[0] === this.stack[end - 2] &&
            playedCards[0] === this.stack[end - 3] &&
            playedCards[0] === this.stack[end - 4]) {
            successively = true;
        }
        return (alltogether || successively) ? true : false;
    };

    makeAWinner(i) {
        this.isOver = true;
        this.winnersIndex = i;
    };

    sortHandCards(index) {
        this.cards[index].handCards.sort(numericSort);
    };

    sortLastCards(index) {
        this.cards[index].lastCards.sort(numericSort);
    };

    pickUp() {
        while (this.stack.length > 0) {
            this.cards[this.currentPlayerIdx].handCards.push(this.stack.pop());
        }
        this.sortHandCards(this.currentPlayerIdx);
        this.sortLastCards(this.currentPlayerIdx);
        this.setNextPlayer();
    };

    swapCards(playerIndex, newhand, newlast) {
        this.cards[playerIndex].handCards = newhand;
        this.cards[playerIndex].lastCards = newlast;
        this.sortHandCards(playerIndex);
        this.sortLastCards(playerIndex);
        return this;
    };

    burnStack() {
        while (this.stack.length > 0) {
            this.outOfGameCards.push(this.stack.pop());
        }
    };

    faceUp(playerIndex, flippedCardIndex) {
        let flippedCard = this.cards[playerIndex].flippedCards.splice(flippedCardIndex, 1)[0];
        this.cards[playerIndex].handCards.push(flippedCard);
    };

    setNextPlayer() {
        // Not an elegant way: TODO: use recursion
        if (this.stack[this.stack.length - 1] === 8) {
            this.skip();
            return;
        }
        if (this.stack[this.stack.length - 1] === 3) {
            if (this.stack[this.stack.length - 2] === 8) {
                this.skip();
                return;
            }
            if (this.stack[this.stack.length - 2] === 3) {
                if (this.stack[this.stack.length - 3] === 8) {
                    this.skip();
                    return;
                }
                if (this.stack[this.stack.length - 3] === 3) {
                    if (this.stack[this.stack.length - 4] === 8) {
                        this.skip();
                        return;
                    }
                }
            }
        }
        this.noSkip();
    };

    noSkip() {
        this.currentPlayerIdx = (this.currentPlayerIdx + 1) % this.players.length;
    };

    skip() {
        this.currentPlayerIdx = (this.currentPlayerIdx + 2) % this.players.length;
    };

};

function getDeck() {
    let values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    let deck = []
    values.forEach((elem) => {
        for (let i = 0; i < 4; i++) {
            deck.push(elem);
        }
    });
    return deck;
};

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
};

function getSuffledDeck() {
    return shuffle(getDeck());
};

function handOutCards(deck, players) {
    let cardsArr = [];
    players.forEach(() => {
        let playersCards = {
            flippedCards: [deck.pop(), deck.pop(), deck.pop()],
            lastCards: [deck.pop(), deck.pop(), deck.pop()],
            handCards: [deck.pop(), deck.pop(), deck.pop()],
        };
        cardsArr.push(playersCards);
    });
    return cardsArr;
};

function numericSort(a, b) {
    return a - b;
};

module.exports = Game;