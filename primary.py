from os import system
cls = lambda : system('cls')

board = [[0,0,0],
         [0,0,0],
         [0,0,0]]
player1 = 1
player2 = -1
no_move = [None, None]
draw = 0

def wins(state, player):
    # diagonal
    if (state[0][0] == state[1][1] == state[2][2] == player) or (state[0][2] == state[1][1] == state[2][0] == player):
        return True
    for i in range(len(state)):
        if (state[i][0] == state[i][1] == state[i][2] == player) or (state[0][i] == state[1][i] == state[2][i] == player):
            return True
    return False

def game_end(state):
    if wins(state, player1) or wins(state, player2): return True
    for row in state:
        for cell in row:
            if cell == 0:
                return False
    return True

def evaluate(state):
    if wins(state, player1):
        return player1
    elif wins(state, player2):
        return player2
    else:
        return 0

def possible_moves(state):
    moves = []
    for x, row in enumerate(state):
        for y, cell in enumerate(row):
            if cell == 0:
                moves.append([x,y])
    return moves

def state_with_move(state, move, player):
    state[move[0]][move[1]] = player
    return state

def minimax(state, depth, player):
    # if endpoint:
    if depth == 0 or game_end(state):
        return [no_move,evaluate(state)]
    
    # not endpoint
    register = []
    for move in possible_moves(state):
        register.append([move, minimax(state_with_move(state, move, player), depth - 1, -player)[1]])
    if player == player1:
        # maximising
        max_val = max([item[1] for item in register])
        max_set = [item for item in register if item[1] == max_val][0]
        return max_set
    if player == player2:
        # minimizing
        min_val = min([item[1] for item in register])
        min_set = [item for item in register if item[1] == min_val][0]
        return min_set

def main():
    difficulty = 10
    comp_player = player2
    current_player = player1
    while not game_end:
        if current_player == comp_player:
            move = minimax(board, difficulty, current_player)
        else:
            cls()
            print(board)
            input_move = str(input("Enter your move: ")).split(',')
            move = [int(input_move[0]), int(input_move[1])]
        board = state_with_move(board, move, current_player)
    result = evaluate(board)
    if result == player1:
        print("Yay! you won")
    elif result == 0:
        print("You got a draw")
    elif result == player2:
        print("Good luck next time")

if __name__ == "__main__":
    main()