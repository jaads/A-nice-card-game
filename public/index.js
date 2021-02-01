// dev: http://localhost:4000, prod: http://shithead
export const socket = io('http://shithead');

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