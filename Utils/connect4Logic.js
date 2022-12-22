module.exports = class Util {
    static connect4Renderer(board) {
        let str = '', i, j
        for (i = 0; i < board.length; i++) {
            for (j = 0; j < board[i].length; j++) {
                if (board[i][j] === 0) {
                    str += ':no_emoji:'
                } else if (board[i][j] === 1) {
                    str += ':red_circle:'
                } else if (board[i][j] === 2) {
                    str += ':large_blue_circle:'
                } else {
                    str += str
                }
            }
            str += '\n'
        }
        return str + ':one::two::three::four::five::six::seven:'
    }

    static connect4ArrayManager(board, col, color) {
        let x = parseInt(col)
        if (isNaN(x) || x < 1 || x > 7) return false
        else {
            let pos = x - 1
            if (board[0][pos] !== 0) return false
            for (let i = 0; i < board.length; i++) {
                if (board[i][pos] !== 0) break
                else if (board[i][pos] === 0) {
                    if (!board[i + 1] || board[i + 1][pos] !== 0) {
                        board[i][pos] = color
                    } else {
                        continue
                    }
                }
            }
            return board
        }
    }
    static connect4WinCheck(board) {
        // Check for vertical wins
        for (let i = 0; i < board.length - 3; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] !== 0 &&
                    board[i][j] === board[i + 1][j] &&
                    board[i + 1][j] === board[i + 2][j] &&
                    board[i + 2][j] === board[i + 3][j]) {
                    return board[i][j];
                }
            }
        }

        // Check for horizontal wins
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length - 3; j++) {
                if (board[i][j] !== 0 &&
                    board[i][j] === board[i][j + 1] &&
                    board[i][j] === board[i][j + 2] &&
                    board[i][j] === board[i][j + 3]) {
                    return board[i][j];
                }
            }
        }

        // Check for diagonal wins (top left to bottom right)
        for (let i = 0; i < board.length - 3; i++) {
            for (let j = 0; j < board[i].length - 3; j++) {
                if (board[i][j] !== 0 &&
                    board[i][j] === board[i + 1][j + 1] &&
                    board[i][j] === board[i + 2][j + 2] &&
                    board[i][j] === board[i + 3][j + 3]) {
                    return board[i][j];
                }
            }
        }

        //Check for another diagonal wins (top right to bottom left)
        for (let i = 0; i < board.length; i++) {
            for (let j = 3; j < board[i].length - 3; j++) {
                if (board[i][j] !== 0 &&
                    board[i][j] === board[i - 1][j + 1] &&
                    board[i][j] === board[i - 2][j + 2] &&
                    board[i][j] === board[i - 3][j + 3]) {
                    return board[i][j];
                }
            }
        }
        return false
    }
}