from copy import deepcopy
from math import inf
import platform
from os import system



if platform.system() == 'Windows':
    def clear():
        system('cls')
else:
    def clear():
        system('clear')

board = [[0,0,0],
         [0,0,0],
         [0,0,0]]

player1 =  1
player2 = -1
null_move = [None, None]
draw    =  0



def _allequal(*args) -> bool:
    value = args[0]
    for arg in args[1:]:
        if arg != value:
            return False
    return True



def wins(state: list, player: int) -> bool:
    """
    Returns if the player won in the state

    For the given board position 'state' returns
    if the given 'player' has won the game or not.

    Parameters
    ----------
    state : list
        The board position to be evaluated
    player : int
        The player to be checked if they won or not
    """

    if  _allequal(player, state[0][0], state[1][1], state[2][2]) \
        or _allequal(player, state[0][2], state[1][1], state[2][0]):
        return True

    for i in range(len(state)):
        if  _allequal(player, state[i][0], state[i][1], state[i][2]) \
            or _allequal(player, state[0][i], state[1][i], state[2][i]):
            return True
    return False

def game_end(state: list) -> bool:
    """
    Returns if the game has ended

    For the given board position 'state' returns
    if the game can be continued or not.

    Parameters
    ----------
    state : list
        The board position to be evaluated
    """

    if wins(state, player1) or wins(state, player2):
        return True
    else:
        for row in state:
            for cell in row:
                if cell == 0:
                    return False
        return True

def evaluate(state: list) -> int:
    """
    Returns which player has won the game

    For the given board position 'state' returns
    the player who has won the game

    Parameters
    ----------
    state : list
        The board position to be evaluated
    """

    if wins(state, player1):
        return player1
    elif wins(state, player2):
        return player2
    else:
        return 0

def possible_moves(state: list) -> list:
    """
    Returns list of all possible moves

    For the given board position 'state' returns
    list of all possible moves for the next turn

    Parameters
    ----------
    state : list
        The board position to be evaluated
    """

    moves = []
    for x, row in enumerate(state):
        for y, cell in enumerate(row):
            if cell == 0:
                moves.append([x,y])
    return moves

def play_move(state: list, move: list, player: int) -> list:
    """
    Returns the board position with the specified move played

    For the given board position 'state', the move to be
    played and the player playing the move returns the
    state after the move was played

    Parameters
    ----------
    state : list
        The board position for the move to be played
    move : list
        The move to be played on the given board position
    player : int
        The player playing the move
    """

    new_state = state
    new_state[move[0]][move[1]] = player
    return new_state

def minimax(state: list, depth: int, player: int) -> list:
    """
    Returns the [Move, Best Evaluation] for given state, depth, player

    Runs the minimax algorithm with depth 'depth' for player 'player'
    for the given board position 'state'. Returns the best move and
    the best evaluation for it.

    Parameters
    ----------
    state : list
        The board position to be evaluated
    depth : int
        The maximum depth to which the minimax algorithm should evaluate
    player : int
        The player whose move is to be optimised
    """

    if depth == 0 or game_end(state):
        return [null_move, evaluate(state)]
    
    else:
        if player == player1:
            best = [null_move, -inf]
            for move in possible_moves(state):
                next_state = play_move(deepcopy(state), move, player)
                tree_eval = minimax(next_state, depth - 1, -player)
                if tree_eval[1] > best[1]:
                    best = [move, tree_eval[1]]
            return best
        else:
            best = [null_move, inf]
            for move in possible_moves(state):
                next_state = play_move(deepcopy(state), move, player)
                tree_eval = minimax(next_state, depth - 1, -player)
                if tree_eval[1] < best[1]:
                    best = [move, tree_eval[1]]
            return best

def display(state: list) -> None:
    """
    Displays the board in a much better way

    Parameters
    ----------
    state : list
        The board position to be displayed
    """

    char = {-1: 'O',0: ' ',1: 'X'}
    for row in state:
        print(char[row[0]], "|", char[row[1]], "|", char[row[2]])
        print("---------")

def get_comp_move(state: list, depth: int, player: int) -> list:
    """
    Returns the best move for the computer based on the given parameters

    For a given board position, depth and the computer player returns the
    best move by the minimax algorithm

    Parameters
    ----------
    state : list
        The state to be evaluated for best move
    depth : int
        The depth to which the minimax algorithm searches
    player : int
        The player whose move it is in the given state
    """

    evaluation = minimax(state, depth, player)
    best_move = evaluation[0]
    return best_move

def get_player_move() -> list:
    inp_string = input("Enter your move: ")
    coords = inp_string.split(',')
    move = [int(coord) for coord in coords]
    return move



def main() -> None:
    """
    The main function containing all of the functions
    """

    global board

    difficulty = 10
    comp_player = None
    current_player = player1

    while not game_end(board):
        if current_player == comp_player:
            move = get_comp_move(board, difficulty, current_player)
        
        else:
            clear()
            display(board)
            move = get_player_move()

        board = play_move(board, move, current_player)
        current_player *= -1
    
    result = evaluate(board)
    
    if result == player1:
        clear()
        display(board)
        print("Yay! you won")
    
    elif result == 0:
        clear()
        display(board)
        print("You got a draw")
    
    elif result == player2:
        clear()
        display(board)
        print("You lost, good luck next time")

if __name__ == "__main__":
    main()