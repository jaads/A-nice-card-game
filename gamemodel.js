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
    };

    getCardFromDeck() {
        return this.deck.pop();
    };

    initstack() {
        let firstCard = this.getCardFromDeck();
        while (firstCard == 10) {
            this.outOfGameCards.push(firstCard);
            console.log("First card was a 10.");
            firstCard = this.getCardFromDeck();
        }
        return [firstCard];
    };

    makemove(playedCards) {
        let playersCardsOnFirstStage = this.cards[this.currentPlayerIdx].handCards;
        let playersCardsOnSecondStage = this.cards[this.currentPlayerIdx].lastCards;
        let playersCardsOnThirdStage = this.cards[this.currentPlayerIdx].flippedCards;

        // Remove card from hand
        playedCards.forEach(card => {
            if (playersCardsOnFirstStage.indexOf(card) != -1) {
                playersCardsOnFirstStage.splice(playersCardsOnFirstStage.indexOf(card), 1);
            } else if (playersCardsOnSecondStage.indexOf(card) != -1) {
                playersCardsOnSecondStage.splice(playersCardsOnSecondStage.indexOf(card), 1);
            } else if (playersCardsOnThirdStage.indexOf(card) != -1) {
                playersCardsOnThirdStage.splice(playersCardsOnThirdStage.indexOf(card), 1);
            }

            // Put on stack
            this.stack.push(card);
        });

        // Get new card from deck if needed
        while (this.deck.length > 0 && playersCardsOnFirstStage.length < 3) {
            this.cards[this.currentPlayerIdx].handCards.push(this.getCardFromDeck());
        }

        if (playedCards[0] != 10) {
            this.setNextPlayer();
        } else {
            while (this.stack.length > 0) {
                this.outOfGameCards.push(this.stack.pop());
            }
        }

    };

    pickUp() {
        while (this.stack.length > 0) {
            this.cards[this.currentPlayerIdx].handCards.push(this.stack.pop());
        }
        this.setNextPlayer();
    };

    setNextPlayer() {
        if (this.stack[this.stack.length - 1] != 8) {
            this.currentPlayerIdx = (this.currentPlayerIdx + 1) % this.players.length;
        } else {
            this.currentPlayerIdx = (this.currentPlayerIdx + 2) % this.players.length;
        }
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

module.exports = Game;