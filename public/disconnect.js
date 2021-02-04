import { socket, datastore } from "./index.js";
import { showPlayerLeftSection } from './rendering/section-rendering.js';


socket.on('coplayer-disconnected', () => {
    showPlayerLeftSection();
    datastore.game = null;
    datastore.index = null;
});