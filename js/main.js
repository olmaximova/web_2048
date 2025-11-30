import { createElement } from "./elements.js";
import { initMobileControls, addToHistory } from './game.js';
import { HEADERS } from "./data.js";
import { setGameStarted, setBoard, getGameStarted, getBoard, saveGameState, getScore } from './state.js';
import { updateLeaders } from './gameover.js'

export const startGame = () => {
    setGameStarted(true);
    createBoard();
    addNumbersBoard();
    addToHistory({
        board: JSON.parse(JSON.stringify(getBoard())),
        score: getScore()
    });
    saveGameState();
    initMobileControls();
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

    const board = getBoard();

    const newContainer = document.createElement('div');
    newContainer.className = 'numContainer';

    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellElement = createElement({
                tag: 'div',
                className: 'numCell',
                dataset: { row: rowIndex, col: colIndex }
            });

            if (cell !== 0) {
                const existingTile = Array.from(boardContainer.querySelectorAll('.tile')).find(tile => {
                    const parent = tile.parentElement;
                    return parent &&
                        parseInt(parent.dataset.row) === rowIndex &&
                        parseInt(parent.dataset.col) === colIndex &&
                        tile.textContent === cell.toString();
                });

                const tile = existingTile ? existingTile : createElement({
                    tag: 'div',
                    className: 'tile' + (!existingTile ? ' new' : ''),
                    text: cell.toString(),
                    attributes: {
                        'data-value': cell.toString()
                    }
                });

                if (!existingTile) {
                    setTimeout(() => {
                        tile.classList.remove('new');
                    }, 10);
                }

                cellElement.appendChild(tile);
            }

            newContainer.appendChild(cellElement);
        });
    });

    boardContainer.parentNode.replaceChild(newContainer, boardContainer);
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

    document.getElementById('leadersBtn').addEventListener('click', () => {
        openCloseModal('open');
        updateLeaders();
    });

    modalHeader.append(title, closeBtn);

    const table = createResultsTable();

    content.append(modalHeader, table);
    modal.appendChild(content);
    main.appendChild(modal);
}

const openCloseModal = (type) => {
    const modal = document.querySelector('.modalResultsLeaders');
    const controls = document.querySelector('.mobile-controls');

    switch (type) {
        case 'close':
            modal.classList.remove('show');
            initMobileControls();
            break;
        case 'open':
            modal.classList.add('show');
            controls.classList.remove('showControls');
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

document.addEventListener("DOMContentLoaded", function () {
    createBoard();
    leadersModal();
    initMobileControls();
});