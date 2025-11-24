import { createElement } from "./elements.js";
import { initMobileControls } from './game.js';
import { BOARD, HEADERS } from "./data.js";

export const loadGameState = () => {
    const saved = localStorage.getItem('gameState');
    if (saved) {
        const gameState = JSON.parse(saved);
        return {
            board: gameState.board || BOARD,
            gameStarted: gameState.gameStarted || false,
            score: gameState.score || 0,
            history: gameState.history || [],
            historyIndex: gameState.historyIndex || -1
        };
    }
    return {
        board: BOARD,
        gameStarted: false,
        score: 0,
        history: [],
        historyIndex: -1
    };
};

const initialState = loadGameState();

export const gameState = {
    board: initialState.board,
    started: initialState.gameStarted,
    score: initialState.score,
    history: initialState.history,
    historyIndex: initialState.historyIndex 
}

export const setGameStarted = (value) => {
    gameState.started = value;
    saveGameState();
}

export const setBoard = (newBoard) => {
    gameState.board = JSON.parse(JSON.stringify(newBoard));
    saveGameState();
}

export const getGameStarted = () => gameState.started;
export const getBoard = () => gameState.board;
export const getScore = () => gameState.score;
export const getBestScore = () => gameState.bestScore;

const startBtn = document.getElementById('startBtn');

export const startGame = () => {
    setGameStarted(true);
    createBoard();
    addNumbersBoard();
    startBtn.style.display = 'none';
    saveGameState();
    initMobileControls();
}

startBtn.addEventListener('click', startGame);

if (getGameStarted()) {
    document.addEventListener("DOMContentLoaded", startGame);
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

    if (getGameStarted()) {
        addNumbersBoard();
    }

    if (isBoardEmpty() && getGameStarted()) {
        updateBoard();
        updateBoard();
        saveGameState();
    }
};

function renderBoardCells(container) {
    getBoard().forEach((row, rowIndex) => {
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

            container.appendChild(cellElement);
        });
    });
}

export function addNumbersBoard() {
    const boardSection = document.querySelector('.boardSection');

    const existingContainer = document.querySelector('.numContainer');
    if (existingContainer) {
        existingContainer.remove();
    }

    const boardContainer = createElement({ tag: 'div', className: 'numContainer' })
    
    renderBoardCells(boardContainer);
    
    boardSection.appendChild(boardContainer);
};

export const renderBoard = () => {
    const boardContainer = document.querySelector('.numContainer');

    while (boardContainer.firstChild) {
        boardContainer.removeChild(boardContainer.firstChild);
    }

    renderBoardCells(boardContainer);
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

    getBoard().forEach((row, rowIndex) => {
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

    const board = getBoard();

    if (board[row][col] == 0) {
        board[row][col] = values[Math.floor(Math.random() * values.length)];
        setBoard(board);
    }
}

const isBoardEmpty = () => {
    return getBoard().every(row => row.every(cell => cell == 0));
};

export const saveGameState = () => {
    const gameState = {
        board: getBoard(),
        gameStarted: getGameStarted(),
        score: getScore()
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

export const resetBoard = () => {
    gameState.board = JSON.parse(JSON.stringify(BOARD));
    gameState.started = false;
    gameState.score = 0;
    saveGameState();
};

document.addEventListener("DOMContentLoaded", function () {
    createBoard();
    leadersModal();
});