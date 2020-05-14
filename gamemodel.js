class Game {

    constructor(room, players) {
        this.room = room;
        this.deck = getSuffledDeck();
        this.players = players;
        this.currentPlayerIdx = 0;
        this.cards = handOutCards(this.deck, this.players);
        this.outOfGameCards = [];
        this.stack = this.initstack();
        this.nrofreadyplayers = 0;
        this.isOver = false;
        this.winnersIndex = null;
    };

    getCardFromDeck() {
        return this.deck.pop();
    };

    initstack() {
        this.stack = [];
        let firstCard = this.getCardFromDeck();
        while (firstCard == 10) {
            console.log("First card was a 10.");
            this.burnStack();
            firstCard = this.getCardFromDeck();
        }
        return [firstCard];
    };

    getIndexOfPrevPlayer () {
        return (this.currentPlayerIdx - 1) % this.players.length;
    };
    
    makemove(playedCards, belated) {
        let playersCardsOnFirstStage = this.cards[this.currentPlayerIdx].handCards;
        let playersCardsOnSecondStage = this.cards[this.currentPlayerIdx].lastCards;
        let playersCardsOnThirdStage = this.cards[this.currentPlayerIdx].flippedCards;

        if (belated) {
            playersCardsOnFirstStage = this.cards[this.getIndexOfPrevPlayer()].handCards;
            playersCardsOnSecondStage = this.cards[this.getIndexOfPrevPlayer()].lastCards;
            playersCardsOnThirdStage = this.cards[this.getIndexOfPrevPlayer()].flippedCards;
        }

        this.transferCards(playedCards, playersCardsOnFirstStage, playersCardsOnSecondStage, playersCardsOnThirdStage);
        this.getNewCards();
        this.sortHandCards(this.currentPlayerIdx);

        if (playersCardsOnFirstStage.length == 0
            && playersCardsOnSecondStage.length == 0
            && playersCardsOnThirdStage.length == 0) {
            this.finish();
        } else if (playedCards[0] == 10 || this.fourInARow(playedCards)) {
            this.burnStack();
        } else {
            if (!belated) {
                this.setNextPlayer();
            }
        }
    };

    transferCards(playedCards, playersCardsOnFirstStage, playersCardsOnSecondStage, playersCardsOnThirdStage) {
        // Remove card from hand
        playedCards.forEach(card => {
            if (playersCardsOnFirstStage.indexOf(card) != -1) {
                playersCardsOnFirstStage.splice(playersCardsOnFirstStage.indexOf(card), 1);
            } else if (playersCardsOnSecondStage.indexOf(card) != -1) {
                playersCardsOnSecondStage.splice(playersCardsOnSecondStage.indexOf(card), 1);
            } else if (playersCardsOnThirdStage.indexOf(card) != -1) {
                playersCardsOnThirdStage.splice(playersCardsOnThirdStage.indexOf(card), 1);
            }
            this.stack.push(card);
        });
    };

    getNewCards() {
        while (this.deck.length > 0 && this.cards[this.currentPlayerIdx].handCards.length < 3) {
            this.cards[this.currentPlayerIdx].handCards.push(this.getCardFromDeck());
        }
    };

    fourInARow(playedCards) {
        let alltogether = playedCards.length == 4;
        let successively = false;
        let end = this.stack.length;
        if (playedCards[0] == this.stack[end - 1] &&
            playedCards[0] == this.stack[end - 2] &&
            playedCards[0] == this.stack[end - 3] &&
            playedCards[0] == this.stack[end - 4]) {
            successively = true;
        }
        return (alltogether || successively) ? true : false;
    };

    finish() {
        this.isOver = true;
        this.winnersIndex = this.currentPlayerIdx;
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
    };

    burnStack() {
        while (this.stack.length > 0) {
            this.outOfGameCards.push(this.stack.pop());
        }
    };

    faceUp(flippedCardIndex) {
        let flippedCard = this.cards[this.currentPlayerIdx].flippedCards.splice(flippedCardIndex, 1)[0];
        this.cards[this.currentPlayerIdx].handCards.push(flippedCard);
    };

    setNextPlayer() {
        // Not an elegant way: TODO: use recursion
        if (this.stack[this.stack.length - 1] == 8) {
            this.skip();
            return;
        }
        if (this.stack[this.stack.length - 1] == 3) {
            if (this.stack[this.stack.length - 2] == 8) {
                this.skip();
                return;
            }
            if (this.stack[this.stack.length - 2] == 3) {
                if (this.stack[this.stack.length - 3] == 8) {
                    this.skip();
                    return;
                }
                if (this.stack[this.stack.length - 3] == 3) {
                    if (this.stack[this.stack.length - 4] == 8) {
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
    let tmp = [];
    players.forEach(() => {
        let playersCards = {
            flippedCards: [deck.pop(), deck.pop(), deck.pop()],
            lastCards: [deck.pop(), deck.pop(), deck.pop()],
            handCards: [deck.pop(), deck.pop(), deck.pop()],
        };
        tmp.push(playersCards);
    });
    return tmp;
};

function numericSort(a, b) {
    return a - b;
};

module.exports = Game;