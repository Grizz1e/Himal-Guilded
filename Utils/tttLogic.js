module.exports = class Util {
    static tttRenderer(board) {
        let numEquiv = {
            0: ':one:', 1: ':two:', 2: ':three:',
            3: ':four:', 4: ':five:', 5: ':six:',
            6: ':seven:', 7: ':eight:', 8: ':nine:'
        }
        let str = '', i, j
        for (i = 0; i < board.length; i++) {
            for (j = 0; j < board[i].length; j++) {
                if (board[i][j] === 0) {
                    if (i === 0) {
                        str += numEquiv[j]
                    } else if (i === 1) {
                        str += numEquiv[j + 3]
                    } else {
                        str += numEquiv[j + 6]
                    }
                } else if (board[i][j] === 1) {
                    str += ':x:'
                } else {
                    str += ':o:'
                }
            }
            str += '\n'
        }
        return str
    }

    static tttArrayManager(board, choice, sym) {
        let x = parseInt(choice)
        if (isNaN(x) || x < 1 || x > 9) return false
        else {
            let row = x % 3 === 0 ? Math.floor(x / 3) - 1 : Math.floor(x / 3)
            let col = (x - 1) % 3
            if (board[row][col] !== 0) return false
            else board[row][col] = sym
            return board
        }
    }
    static tttWinCheck(board) {
        for (let i = 0; i < 3; i++) {
            if (board[i][0] === board[i][1] &&
                board[i][1] === board[i][2] &&
                board[i][0] !== 0) return true
            else if (board[0][i] === board[1][i] &&
                board[1][i] === board[2][i] &&
                board[0][i] !== 0) return true
        }
        // Check for diagonal wins (top left to bottom right)
        if (board[0][0] === board[1][1] &&
            board[1][1] === board[2][2] &&
            board[0][0] !== 0) return true
        //Check for another diagonal wins (top right to bottom left)
        if (board[0][2] === board[1][1] &&
            board[1][1] === board[2][0] &&
            board[0][2] !== 0) return true

        let isFull = true
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === 0) {
                    isFull = false
                    break
                }
            }
        }
        if (isFull) {
            return 'draw'
        }
        return false
    }
}