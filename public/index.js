export let socket = io.connect('http://shithead.onl');
// export let socket = io.connect('http://localhost:4000');

export let room = null;
export let game = null;
export let index = null;

export function setRoom(r) {
    room = r;
};

export function setGame(g) {
    game = g;
};

export function setIndex(i) {
    index = i;
};