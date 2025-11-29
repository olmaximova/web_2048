import { updateBoard, renderBoard, startGame } from './main.js';
import { gameState, setBoard, getGameStarted, getBoard, getScore, saveGameState, resetBoard } from './state.js'
import { checkGameStatus } from './gameover.js'

document.addEventListener('keydown', function (event) {
    if (event.target.id === 'player-name' || event.target.tagName === 'INPUT') {
        return;
    }

    event.preventDefault();

    let moved = false;

    switch (event.key) {
        case 'ArrowUp':
            moved = move('up');
            break;
        case 'ArrowDown':
            moved = move('down');
            break;
        case 'ArrowLeft':
            moved = move('left');
            break;
        case 'ArrowRight':
            moved = move('right');
            break;
        default:
            return;
    }

    if (moved) {
        updateBoard();
        addToHistory();
        saveGameState();
        renderBoard();
        checkGameStatus();
    }
});

const move = (direction) => {
    let moved = false;
    const board = getBoard();
    let points = 0;

    for (let i = 0; i < 4; i++) {
        let line = [];

        if (direction === 'left' || direction === 'right') {
            line = [...board[i]];
        } else {
            for (let j = 0; j < 4; j++) {
                line.push(board[j][i]);
            }
        }

        let newLine = line.filter(cell => cell !== 0);

        for (let j = 0; j < newLine.length - 1; j++) {
            if (newLine[j] === newLine[j + 1]) {
                const toAdd = newLine[j] * 2;
                points += toAdd;
                newLine[j] = toAdd;
                newLine[j + 1] = 0;
                moved = true;
            }
        }

        newLine = newLine.filter(cell => cell !== 0);

        while (newLine.length < 4) {
            if (direction === 'right' || direction === 'down') {
                newLine.unshift(0);
            } else {
                newLine.push(0);
            }
        }

        for (let j = 0; j < 4; j++) {
            let oldValue, newValue;

            if (direction === 'left' || direction === 'right') {
                oldValue = board[i][j];
                newValue = newLine[j];
                if (oldValue !== newValue) moved = true;
                board[i][j] = newValue;
            } else {
                oldValue = board[j][i];
                newValue = newLine[j];
                if (oldValue !== newValue) moved = true;
                board[j][i] = newValue;
            }
        }
    }

    if (moved) {
        setBoard(board);
        if (points > 0) {
            updateScore(points);
        }
    }

    return moved;
};

const isMobile = () => {
    const isTouchScreen = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    return isTouchScreen;
}

export const initMobileControls = () => {
    const mobileControls = document.querySelector('.mobile-controls');

    if (isMobile() && getGameStarted()) {
        mobileControls.classList.add('showControls');
        setupMobileControls();
    } else {
        mobileControls.classList.remove('showControls');
    }
}

const setupMobileControls = () => {
    const buttons = {
        'up-btn': 'up',
        'down-btn': 'down', 
        'left-btn': 'left',
        'right-btn': 'right'
    };
    
    Object.entries(buttons).forEach(([id, direction]) => {
        const btn = document.getElementById(id);
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleMobileMove(direction);
        });
    });
}

let isMove = false; 

const handleMobileMove = (direction) => {
    if (isMove) return; 
    
    isMove = true;
    
    const moved = move(direction);
    if (moved) {
        updateBoard();
        addToHistory();
        saveGameState();
        renderBoard();
        checkGameStatus();
    }
    
    setTimeout(() => {
        isMove = false;
    }, 300);
}

const newGameBtn = document.getElementById('newGameHeaderBtn');
newGameBtn.addEventListener('click', () => newGame());

export const newGame = () => {
    resetBoard();
    displayScore();
    startGame();
};

const updateScore = (points) => {
    gameState.score += points;
    saveGameState();
    displayScore();
    return gameState.score;
};

const displayScore = () => {
    const score = document.getElementById('score');

    if (score) score.textContent = getScore()
}

export const addToHistory = () => {
    const currentState = {
        board: JSON.parse(JSON.stringify(getBoard())),
        score: getScore()
    };

    gameState.history.push(currentState);

    if (gameState.history.length > 50) {
        gameState.history.shift();
    }

    saveGameState();
}

const undoMove = () => {
    if (gameState.history.length < 2) {
        return false;
    }

    gameState.history.pop();

    const previousState = gameState.history[gameState.history.length - 1];

    gameState.board = JSON.parse(JSON.stringify(previousState.board));
    gameState.score = previousState.score;
    gameState.historyIndex = gameState.history.length - 1;

    saveGameState();
    renderBoard();
    displayScore();
    return true;
}

document.getElementById('backtBtn').addEventListener('click', () => {
    if (getGameStarted()) {
        undoMove();
    }
});

window.addEventListener('resize', initMobileControls);

document.addEventListener("DOMContentLoaded", function () {
    displayScore();
});