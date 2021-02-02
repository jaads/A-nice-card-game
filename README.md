# A nice card game

To get a basic idea of the game, check out [wikipedia](https://en.wikipedia.org/wiki/Shithead_(card_game)).

Start a development server using nodemon: `npm run dev` or simply run `node server.js` for production.
You'll also need to change the application server for `socket.io` in `public/index.js` from `io.connect('shithead.onl');` to `io.connect('localhost:4000');`.

To run Jest tests,  run `npm run tests`.

## Websockets workflow

sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!