let assist, winboard, player1, player2, gameEnd, difficulty, mobile;

function _allequal(a, b, c, d) {
    if (a === b && a === c && a === d) return true
    return false
}

function _deepcopy(item) {
    return JSON.parse(JSON.stringify(item))
}

function _isSetCookie() {
    if (document.cookie == '') return false
    return true
}

function _setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function _getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function _assistSet(id) {
    assist = document.getElementById(id).checked
    _setCookie('assist',String(assist),7)
}

function _assistGet() {
    document.getElementById('assistSwitch').checked = assist
}

function _bool(value) {
    if (value == 'true') {
        return true
    }
    return false
}

function init() {
    if (!_isSetCookie()) {
        assist = false
        _assistGet()
        _setCookie('assist','false',7)
        _setCookie('difficulty','8',7)
    }
    else {
        assist = _bool(_getCookie('assist'))
        _assistGet()
        document.getElementById('difficultySlider').value = Number(_getCookie('difficulty'))
    }
    board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    player1 =  1
    player2 = -1
    gameEnd = false
    difficultyChange('difficultySlider')
    sliderPosition()
    for (let element of document.getElementsByClassName('cell')) {
        element.style.color = "darkslategray"
    }
    displayUpdate()
    __clearEvaluations()
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

function minimax(state, depth, player) {
	var best;

	if (player == player1) {
		best = [NaN, NaN, -Infinity];
	}
	else {
		best = [NaN, NaN,  Infinity];
	}

	if (depth == 0 || game_end(state)) {
		var score = evaluate(state);
		return [NaN, NaN, score];
	}

	possible_moves(state).forEach(function (cell) {
		var x = cell[0];
		var y = cell[1];
		state[x][y] = player;
		var score = minimax(state, depth - 1, -player);
		state[x][y] = 0;
		score[0] = x;
		score[1] = y;

		if (player == player1) {
			if (score[2] > best[2])
				best = score;
		}
		else {
			if (score[2] < best[2])
				best = score;
		}
	});

	return best;
}

// In testing Do Not Use
function __deep_evaluation(state, depth, player) {
	var evaluations = []
    if (depth == 0 || game_end(state)) {
		var score = evaluate(state);
		return [NaN, NaN, score];
	}

	possible_moves(state).forEach(function (cell) {
		var x = cell[0];
		var y = cell[1];
		state[x][y] = player;
		var score = minimax(state, depth - 1, -player);
		state[x][y] = 0;
		score[0] = x;
		score[1] = y;
        evaluations.push(score)
	});

	return evaluations;
}

function __toScreen(evaluations) {
    for (let evaluation of evaluations) {
        var x = evaluation[0]
        var y = evaluation[1]
        var score = evaluation[2]
        var id = 'cell'+x+y
        if (score == 1) {
            document.getElementById(id).style.backgroundColor = 'rgba(0,255,0,0.3)'
        } else if (score == -1) {
            document.getElementById(id).style.backgroundColor = 'rgba(255,0,0,0.3)'
        }
    }
}

function __clearEvaluations() {
    for (let x = 0; x <= 2; x++) {
        for (let y = 0; y <= 2; y++) {
            var id = 'cell'+x+y
            document.getElementById(id).style.backgroundColor = 'rgba(0,0,0,0)'
        }
    }
}

function displayUpdate() {
    for (let x = 0; x <= 2; x++) {
        for (let y = 0; y <= 2; y++) {
            var char = ''
            var cell = board[x][y]
            if (cell == player1) {
                char = 'X'
            } else if (cell == player2) {
                char = 'O'
            }
            document.getElementById('cell'+x+y).innerText = char
        }
    }
}

function clickedCell(id) {
    if (gameEnd) {
        init()
        return 0
    }

    var x = Number(id[4])
    var y = Number(id[5])
    if (board[x][y] == 0) {
        board[x][y] = player1
        displayUpdate()
    } else {
        wrongMove()
        return 0
    }
    if (!game_end(board)) {
        best = minimax(board, difficulty, player2)
        board[best[0]][best[1]] = player2
        displayUpdate()
        __clearEvaluations()
        if (!game_end(board) && assist) {
            var evaluations = __deep_evaluation(board, 9, player1)
            __toScreen(evaluations)
        }
    }
    if (game_end(board)) {
        gameEnded()
    }
}

function gameEnded() {
    gameEnd = true
    win_player = evaluate(board)
    if (_allequal(win_player, board[0][0], board[1][1], board[2][2])) {
        document.getElementById('cell00').style.color = "brown"
        document.getElementById('cell11').style.color = "brown"
        document.getElementById('cell22').style.color = "brown"
    } else if (_allequal(win_player, board[2][0], board[1][1], board[0][2])) {
        document.getElementById('cell20').style.color = "brown"
        document.getElementById('cell11').style.color = "brown"
        document.getElementById('cell02').style.color = "brown"
    }
    for (let i = 0; i <= 2; i++) {
        if (_allequal(win_player, board[i][0], board[i][1], board[i][2])) {
            document.getElementById('cell'+i+'0').style.color = "brown"
            document.getElementById('cell'+i+'1').style.color = "brown"
            document.getElementById('cell'+i+'2').style.color = "brown"
        }
    }
    for (let i = 0; i <= 2; i++) {
        if (_allequal(win_player, board[0][i], board[1][i], board[2][i])) {
            document.getElementById('cell0'+i).style.color = "brown"
            document.getElementById('cell1'+i).style.color = "brown"
            document.getElementById('cell2'+i).style.color = "brown"
        }
    }
}

function wrongMove() {
    document.getElementById('wrongMove').style.opacity = 1;
    setTimeout(function() {
        document.getElementById('wrongMove').style.opacity = 0;
    }, 600)
}

function difficultyChange(id) {
    difficulty = document.getElementById(id).value
    document.getElementById('difficultyDisplay').innerText = difficulty
    _setCookie('difficulty', String(difficulty), 7)
}

function sliderPosition() {
    let display = document.getElementById('difficultyDisplay')
    let root = document.querySelector(':root')
    mobile = window.innerWidth < window.innerHeight
    if (mobile) {
        root.style.setProperty('--difficulty-right', '12vw')
        root.style.setProperty('--difficulty-top', '86vh')
        root.style.setProperty('--assist-left', '15vw')
        display.style.opacity = '0'
    } else {
        root.style.setProperty('--difficulty-right', '7vw')
        root.style.setProperty('--difficulty-top', '10vh')
        root.style.setProperty('--assist-left', 'none')
        display.style.opacity = '1'
    }
}