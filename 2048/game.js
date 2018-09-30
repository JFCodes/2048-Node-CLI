const clc = require('cli-color')
const identifier = (l, c) => `${l}-${c}`

class Game {
    constructor (size) {
        this.terminated = false
        this.size = size
        this.matrix = null
        
        this.nextMove_up = null
        this.nextMove_right = null
        this.nextMove_down = null
        this.nextMove_left = null
        this.nextMove_up_hadChange = false
        this.nextMove_rigth_hadChange = false
        this.nextMove_down_hadChange = false
        this.nextMove_left_hadChange = false

        this._initiate()
        this._generateNextMoves()
        this.print()
    }

    // Public
    print (move) {
        const numberToColor = (number, blank) => {
            const stringLen = String(number).length
            const spaces = 7 - stringLen
            const content = () => {
                if (blank) return ' '.repeat(10)
                return '   ' + number + ' '.repeat(spaces)
            }
            if (number === 0) return ' '.repeat(10)
            if (number === 2) return clc.bgYellowBright.black(content())
            if (number === 4) return clc.bgRedBright.black(content())
            if (number === 8) return clc.bgMagentaBright.black(content())
            if (number === 16) return clc.bgGreenBright.black(content())
            if (number === 32) return clc.bgCyanBright.black(content())
            if (number === 64) return clc.bgBlueBright.black(content())
            if (number === 128) return clc.bgBlackBright.whiteBright(content())
            if (number === 256) return clc.bgBlackBright.whiteBright(content())
            if (number === 512) return clc.bgBlackBright.whiteBright(content())
            if (number === 1024) return clc.bgBlackBright.whiteBright(content())
            if (number === 2048) return clc.bgBlackBright.whiteBright(content())
            return clc.bgWhiteBright.black(content())
        }

        process.stdout.write(clc.erase.screen)
        console.log(move ? 'You pressed: ' + move : 'New game \n')
        console.log('----------------------------------------')
        for (let l = 1; l <= this.size; l++) {
            let line = ''
            // Before
            for (let c = 1; c <= this.size; c++) {
                line += numberToColor(this.matrix[identifier(l, c)], true)
            }            
            console.log(line)
            line = ''
            // With number
            for (let c = 1; c <= this.size; c++) {
                line += numberToColor(this.matrix[identifier(l, c)], false)
            }
            console.log(line)
            line = ''
            // After
            for (let c = 1; c <= this.size; c++) {
                line += numberToColor(this.matrix[identifier(l, c)], true)
            }
            console.log(line)
        }
        console.log('----------------------------------------')        
    }
    move (move) {
        let validInput = ['up', 'down', 'left', 'right'].indexOf(move) !== -1
        let hadChanges = false
        switch (move) {
            case 'up':
                this.matrix = this.nextMove_up
                hadChanges = this.nextMove_up_hadChange
                break
            case 'down':
                this.matrix = this.nextMove_down
                hadChanges = this.nextMove_down_hadChange                
                break
            case 'left':
                this.matrix = this.nextMove_left
                hadChanges = this.nextMove_left_hadChange
                break
            case 'right':
                this.matrix = this.nextMove_right
                hadChanges = this.nextMove_rigth_hadChange
                break
        }
        if (hadChanges) {
            this._generateCell()
            this._generateNextMoves()
        }
        if (validInput) this.print(move)
    }

    // Private
    _initiate () {
        this.terminated = false
        this.matrix = this._generateMatrix(this.size)
        this._generateCell()
        this._generateCell()
    }

    _generateMatrix (size) {
        let matrix = {}
        for (let l = 1; l <= size; l++) {
            for (let c = 1; c <= size; c++) {
                matrix[identifier(l, c)] = 0
            }            
        }
        return matrix
    }

    _generateCell () {
        let emptyCells = Object.keys(this.matrix).filter((identifier) => {
            return this.matrix[identifier] === 0
        })
        let randomCell = Math.floor(Math.random() * emptyCells.length)
        let randomKey = emptyCells[randomCell]
        let randomValue = Math.random() < 0.8 ? 2 : 4

        this.matrix[randomKey] = randomValue
    }

    _generateNextMoves () {
        const copyMatrix = () => {
            const copied = {}
            Object.keys(this.matrix).map(key => {
                copied[key] = this.matrix[key]
            })
            return copied
        }

        // Default hadChanged to false
        this.nextMove_up_hadChange = false
        this.nextMove_rigth_hadChange = false
        this.nextMove_down_hadChange = false
        this.nextMove_left_hadChange = false
        // Copy matrixes
        this.nextMove_up = copyMatrix()
        this.nextMove_right = copyMatrix()
        this.nextMove_down = copyMatrix()
        this.nextMove_left = copyMatrix()

        this._moveMatrixUp()
        this._moveMatrixDown()
        this._moveMatrixLeft()
        this._moveMatrixRight()

        let noPossibleMoves = !this.nextMove_up_hadChange && !this.nextMove_rigth_hadChange && !this.nextMove_down_hadChange && !this.nextMove_left_hadChange
        if (noPossibleMoves) this.terminated = true
    }
    
        // Matrix plays:
        _moveMatrixUp () {
            let grabNextValue = (nextLine, collumn) => {
                if (nextLine > this.size) return false
                for (let pos = nextLine; pos <= this.size; pos++) {
                    let matrixValue = this.nextMove_up[identifier(pos, collumn)]
                    if (matrixValue !== 0) return {
                        line: pos,
                        value: matrixValue
                    }
                }
                return false
            }
            let computecollumn = (column) => {
                for (let l = 1; l < this.size; l++) {
                    let nextLineAndValue = grabNextValue(l + 1, column)
                    if (!nextLineAndValue) return
                    let cellValue = this.nextMove_up[identifier(l, column)]
                    if (cellValue === 0) {
                        this.nextMove_up_hadChange = true
                        this.nextMove_up[identifier(l, column)] = cellValue = nextLineAndValue.value
                        this.nextMove_up[identifier(nextLineAndValue.line, column)] = 0
                        nextLineAndValue = grabNextValue(nextLineAndValue.line + 1, column)
                        if (!nextLineAndValue) return
                        if(cellValue === nextLineAndValue.value) {
                            this.nextMove_up[identifier(l, column)] = 2 * cellValue
                            this.nextMove_up[identifier(nextLineAndValue.line, column)] = 0
                        }
                    } else {
                        if(cellValue === nextLineAndValue.value) {
                            this.nextMove_up_hadChange = true
                            this.nextMove_up[identifier(l, column)] = 2 * cellValue
                            this.nextMove_up[identifier(nextLineAndValue.line, column)] = 0
                        }
                    }
                }
            }
            // For each collumn
            for (let c = 1; c <= this.size; c++) {
                // For each position
                computecollumn(c)
            }
        }
        _moveMatrixDown () {
            let grabNextValue = (nextLine, collumn) => {
                if (nextLine < 1) return false
                for (let pos = nextLine; pos > 0; pos--) {
                    let matrixValue = this.nextMove_down[identifier(pos, collumn)]
                    if (matrixValue !== 0) return {
                        line: pos,
                        value: matrixValue
                    }
                }
                return false
            }
            let computecollumn = (column) => {
                for (let l = this.size; l > 1; l--) {
                    let nextLineAndValue = grabNextValue(l - 1, column)
                    if (!nextLineAndValue) return
                    let cellValue = this.nextMove_down[identifier(l, column)]
                    if (cellValue === 0) {
                        this.nextMove_down_hadChange = true
                        this.nextMove_down[identifier(l, column)] = cellValue = nextLineAndValue.value
                        this.nextMove_down[identifier(nextLineAndValue.line, column)] = 0
                        nextLineAndValue = grabNextValue(nextLineAndValue.line - 1, column)
                        if (!nextLineAndValue) return
                        if(cellValue === nextLineAndValue.value) {
                            this.nextMove_down[identifier(l, column)] = 2 * cellValue
                            this.nextMove_down[identifier(nextLineAndValue.line, column)] = 0
                        }
                    } else {
                        if(cellValue === nextLineAndValue.value) {
                            this.nextMove_down_hadChange = true
                            this.nextMove_down[identifier(l, column)] = 2 * cellValue
                            this.nextMove_down[identifier(nextLineAndValue.line, column)] = 0
                        }
                    }
                }
            }
            // For each collumn
            for (let c = 1; c <= this.size; c++) {
                // For each position
                computecollumn(c)
            }
        }
        _moveMatrixLeft () {
            let grabNextValue = (line, nextColumn) => {
                if (nextColumn > this.size) return false
                for (let pos = nextColumn; pos <= this.size; pos++) {
                    let matrixValue = this.nextMove_left[identifier(line, pos)]
                    if (matrixValue !== 0) return {
                        column: pos,
                        value: matrixValue
                    }
                }
                return false
            }
            let computeLine = (line) => {
                for (let c = 1; c < this.size; c++) {
                    let nextLineAndValue = grabNextValue(line, c + 1)
                    if (!nextLineAndValue) return
                    let cellValue = this.nextMove_left[identifier(line, c)]
                    if (cellValue === 0) {
                        this.nextMove_left_hadChange = true
                        this.nextMove_left[identifier(line, c)] = cellValue = nextLineAndValue.value
                        this.nextMove_left[identifier(line, nextLineAndValue.column)] = 0
                        nextLineAndValue = grabNextValue(line, nextLineAndValue.column + 1)
                        if (!nextLineAndValue) return
                        if(cellValue === nextLineAndValue.value) {
                            this.nextMove_left[identifier(line, c)] = 2 * cellValue
                            this.nextMove_left[identifier(line, nextLineAndValue.column)] = 0
                        }
                    } else {
                        if(cellValue === nextLineAndValue.value) {
                            this.nextMove_left_hadChange = true
                            this.nextMove_left[identifier(line, c)] = 2 * cellValue
                            this.nextMove_left[identifier(line, nextLineAndValue.column)] = 0
                        }
                    }
                }
            }
            // For each collumn
            for (let l = 1; l <= this.size; l++) {
                // For each position
                computeLine(l)
            }
        }
        _moveMatrixRight () {
            let grabNextValue = (line, nextColumn) => {
                if (nextColumn < 1) return false
                for (let pos = nextColumn; pos > 0; pos--) {
                    let matrixValue = this.nextMove_right[identifier(line, pos)]
                    if (matrixValue !== 0) return {
                        column: pos,
                        value: matrixValue
                    }
                }
                return false
            }
            let computeLine = (line) => {
                for (let c = this.size; c > 1; c--) {
                    let nextLineAndValue = grabNextValue(line, c - 1)
                    if (!nextLineAndValue) return
                    let cellValue = this.nextMove_right[identifier(line, c)]
                    if (cellValue === 0) {
                        this.nextMove_rigth_hadChange = true
                        this.nextMove_right[identifier(line, c)] = cellValue = nextLineAndValue.value
                        this.nextMove_right[identifier(line, nextLineAndValue.column)] = 0
                        nextLineAndValue = grabNextValue(line, nextLineAndValue.column - 1)
                        if (!nextLineAndValue) return
                        if(cellValue === nextLineAndValue.value) {
                            this.nextMove_right[identifier(line, c)] = 2 * cellValue
                            this.nextMove_right[identifier(line, nextLineAndValue.column)] = 0
                        }
                    } else {
                        if(cellValue === nextLineAndValue.value) {
                            this.nextMove_rigth_hadChange = true
                            this.nextMove_right[identifier(line, c)] = 2 * cellValue
                            this.nextMove_right[identifier(line, nextLineAndValue.column)] = 0
                        }
                    }
                }
            }
            // For each collumn
            for (let l = 1; l <= this.size; l++) {
                // For each position
                computeLine(l)
            }
        }
}

module.exports = Game
