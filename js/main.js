import { createElement } from "./elements.js";
import { initMobileControls } from './game.js';

const loadGameState = () => {
    const saved = localStorage.getItem('gameState');
    if (saved) {
        const gameState = JSON.parse(saved);
        return {
            board: gameState.board || [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            gameStarted: gameState.gameStarted || false
        };
    }
    return {
        board: [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        gameStarted: false
    };
};

const initialGameState = loadGameState();
export let gameStarted = initialGameState.gameStarted;
export let BOARD = initialGameState.board;

const HEADERS = ["Username", "Score", "Submission Date"];

const startBtn = document.getElementById('startBtn');

const startGame = () => {
    gameStarted = true;
    createBoard();
    addNumbersBoard();
    startBtn.style.display = 'none';
    saveGameState(BOARD, gameStarted);
    initMobileControls();
}

startBtn.addEventListener('click', startGame);

if (gameStarted) {
    document.addEventListener("DOMContentLoaded",
        startGame);
}

export const createBoard = () => {
    const main = document.querySelector('main');

    const existingSection = document.querySelector('.boardSection');
    if (existingSection) {
        existingSection.remove();
    }

    const section = createElement({ tag: 'section', className: 'boardSection' })

    const controls = document.querySelector('.controlsSection');

    main.insertBefore(section, controls);

    if (gameStarted) {
        addNumbersBoard();
    }

    if (isBoardEmpty() && gameStarted) {
        updateBoard();
        updateBoard();
        saveGameState();
    }
};

function addNumbersBoard() {
    const boardSection = document.querySelector('.boardSection');

    const boardContainer = createElement({ tag: 'div', className: 'numContainer' })

    BOARD.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {

            const cellElement = createElement({
                tag: 'div',
                className: 'numCell',
                dataset: { row: rowIndex, col: colIndex }
            });

            if (cell !== 0) {

                const tile = createElement({
                    tag: 'div',
                    className: 'tile',
                    text: cell.toString(),
                    attributes: {
                        'data-value': cell.toString()
                    }
                });

                cellElement.appendChild(tile);
            }

            boardContainer.appendChild(cellElement);
        });
    });

    boardSection.appendChild(boardContainer);
};

export const renderBoard = () => {
    const boardContainer = document.querySelector('.numContainer');

    while (boardContainer.firstChild) {
        boardContainer.removeChild(boardContainer.firstChild);
    }

    BOARD.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {

            const cellElement = createElement({
                tag: 'div',
                className: 'numCell',
                dataset: { row: rowIndex, col: colIndex }
            })

            if (cell !== 0) {
                const tile = createElement({
                    tag: 'div',
                    className: 'tile',
                    text: cell.toString(),
                    attributes: {
                        'data-value': cell.toString()
                    }
                })
                cellElement.appendChild(tile);
            }

            boardContainer.appendChild(cellElement);
        });
    });
};

const createResultsTable = () => {

    const div = createElement({ tag: 'div', className: 'tableResultsContainer' });

    const table = createElement({ tag: 'table', className: 'tableResults' });

    const thead = document.createElement("thead");

    const headerRow = document.createElement("tr");

    const tbody = createElement({ tag: 'tbody', attributes: { id: "results-tbody" } });

    HEADERS.forEach((header) => {
        const th = createElement({ tag: 'th', text: header })
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.append(thead, tbody);
    div.appendChild(table);

    return div;
};

export const leadersModal = () => {
    const main = document.querySelector('main');

    const modal = createElement({
        tag: "section",
        className: "modalResultsLeaders",
        attributes: { style: "display: none" },
        events: {
            click: (event) => {
                if (event.target === modal) {
                    openCloseModal('close');
                }
            }
        }
    });

    const content = createElement({ tag: 'div', className: 'modalContent' })

    const modalHeader = createElement({ tag: 'div', className: 'modalHeader' })

    const title = createElement({ tag: 'h2', text: 'Leaderboard' })

    const closeBtn = createElement({
        text: "x",
        className: "closeBtn",
        events: { click: () => openCloseModal('close') }
    });

    document.getElementById('leadersBtn').addEventListener('click', () => openCloseModal('open'));

    modalHeader.append(title, closeBtn);

    const table = createResultsTable();

    content.append(modalHeader, table);
    modal.appendChild(content);
    main.appendChild(modal);
}

const openCloseModal = (type) => {
    const modal = document.querySelector('.modalResultsLeaders');

    switch (type) {
        case 'close':
            modal.classList.remove('show');
            modal.style.display = 'none';
            break;
        case 'open':
            modal.style.display = 'flex';
            modal.classList.add('show');
            break;
    }
}

const generateNumsGrid = () => {
    const squares = [];

    BOARD.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell === 0) {
                squares.push({ row: rowIndex, col: colIndex });
            }
        });
    });

    const randomNumber = Math.floor(Math.random() * squares.length);

    return squares[randomNumber];
};

export const updateBoard = () => {
    const num = generateNumsGrid();
    const row = num.row;
    const col = num.col;
    const values = [2, 4];

    if (BOARD[row][col] == 0) {
        BOARD[row][col] = values[Math.floor(Math.random() * values.length)];
    }
}

const isBoardEmpty = () => {
    return BOARD.every(row => row.every(cell => cell == 0));
};

export const saveGameState = (board = BOARD, gameStartedFlag = gameStarted) => {
    const gameState = {
        board: board,
        gameStarted: gameStartedFlag
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));

    BOARD = board;
    gameStarted = gameStartedFlag;
};

export const clearGameState = () => {
    localStorage.removeItem('gameState');
};

document.addEventListener("DOMContentLoaded", function () {
    createBoard();
    leadersModal();
});