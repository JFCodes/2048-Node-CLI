const readline = require('readline');   
const Game = require('./2048/game')

const game = new Game(4)

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
        process.exit();
    } else {
        game.move(key.name)
        if (game.terminated) {
            console.log('game over')
            process.exit()
        }
    }
})
