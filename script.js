let board, player1, player2, gameOngoing;

function _allequal(a, b, c, d) {
    if (a === b && a === c && a === d) return true
    return false
}

function init() {
    board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    player1 =  1
    player2 = -1
    gameOngoing = true
}

function wins(state, player) {
    if (_allequal(player, state[0][0], state[1][1], state[2][2]) || _allequal(player, state[2][0], state[1][1], state[0][2])) {
        return true
    } else {
        for (let i = 0; i <= 2; i++) {
            if (_allequal(player, state[i][0], state[i][1], state[i][2]) || _allequal(player, state[0][i], state[1][i], state[2][i])) {
                return true
            }
        }
    }
    return false
}

function game_end(state) {
    if (wins(state, player1) || wins(state, player2)) return true
    else {
        for (let row of state) {
            for (let cell of row) {
                if (cell === 0) return false
            }
        }
    }
    return true
}

function evaluate(state) {
    if (wins(state, player1)) {
        return player1
    }
    else if (wins(state, player2)) {
        return player2
    }
    else return 0
}

function possible_moves(state) {
    let moves = []
    for (let x = 0; x <= 2; x++) {
        for (let y = 0; y <= 2; y++) {
            if (state[x][y] == 0) moves.push([x,y])
        }
    }
    return moves
}

function play_move(state, move, player) {
    state[move[0]][move[1]] = player
    return state
}

function undo_move(state, move) {
    state[move[0]][move[1]] = 0
    return state
}

function minimax(state, depth, player) {
    if ((depth == 0) || game_end(state)) return [NaN, NaN, evaluate(state)]

    if (player == player1) {
        best = [NaN, NaN, -Infinity]
        for (let move of possible_moves(state)) {
            next_state = play_move(state,move,player)
            tree_eval = minimax(next_state, depth - 1, -player)
            if (tree_eval[2] > best[2]) {
                best = [move[0], move[1], [tree_eval[2]]]
            }
        }
        return best
    } else if (player == player2) {
        best = [NaN, NaN, Infinity]
        for (let move in possible_moves(state)) {
            next_state = play_move(state,move,player)
            tree_eval = minimax(next_state, depth - 1, -player)
            if (tree_eval[2] < best[2]) {
                best = [move[0], move[1], [tree_eval[2]]]
            }
        }
        return best
    }
}