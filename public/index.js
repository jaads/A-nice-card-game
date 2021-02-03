// for dev, enter io('http://localhost:4000')
export const socket = io();

export let room = null;
export let game = null;
export let index = null;

export const datastore = {
    room: null,
    game: null,
    index: null
};
