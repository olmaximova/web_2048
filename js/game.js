import { BOARD, updateBoard, saveGameState, createBoard, renderBoard, gameStarted, addNumbersBoard } from './main.js';
import { createElement } from './elements.js';

document.addEventListener('keydown', function (event) {
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
        saveGameState();
        renderBoard();
    }
});

const move = (direction) => {
    let moved = false;

    for (let i = 0; i < 4; i++) {
        let line = [];

        if (direction === 'left' || direction === 'right') {
            line = [...BOARD[i]];
        } else {
            for (let j = 0; j < 4; j++) {
                line.push(BOARD[j][i]);
            }
        }

        let newLine = line.filter(cell => cell !== 0);

        for (let j = 0; j < newLine.length - 1; j++) {
            if (newLine[j] === newLine[j + 1]) {
                newLine[j] *= 2;
                newLine[j + 1] = 0;
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
                oldValue = BOARD[i][j];
                newValue = newLine[j];
                if (oldValue !== newValue) moved = true;
                BOARD[i][j] = newValue;
            } else {
                oldValue = BOARD[j][i];
                newValue = newLine[j];
                if (oldValue !== newValue) moved = true;
                BOARD[j][i] = newValue;
            }
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

    if (isMobile() && gameStarted) {
        mobileControls.style.display = 'flex';
        setupMobileControls();
    } else {
        mobileControls.style.display = 'none';
    }
}

const setupMobileControls = ()  => {
    document.getElementById('up-btn').addEventListener('click', () => handleMobileMove('up'));
    document.getElementById('down-btn').addEventListener('click', () => handleMobileMove('down'));
    document.getElementById('left-btn').addEventListener('click', () => handleMobileMove('left'));
    document.getElementById('right-btn').addEventListener('click', () => handleMobileMove('right'));
}

const handleMobileMove = (direction)  => {
    const moved = move(direction);
    if (moved) {
        updateBoard();
        saveGameState();
        renderBoard();
    }
}

window.addEventListener('resize', initMobileControls);