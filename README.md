# Tic Tac Toe
## An implementation of the Minimax algorithm on the Tic-Tac-Toe game
# The minimax algorithm
Pseudo-code for the algorithm implemented:
```py
minimax(state, depth, isMaximising):
    # End point condition
    if depth = 0 or end(state):
        return move = None , score = evaluation(state)
    
    # If not an end point Node
    else:
        if isMaximising:
            # Set the best initially to least
            bestMove =  None
            bestScore = -infinity
            for every move in possible_moves(state):
                score = score(minimax(state_with_move(state, move), 
                depth-1, not isMaximising))

                if score > bestScore:
                    bestMove = move
                    bestScore = score
        # Invert for minimising
```