import { createElement } from "./elements.js";

const loadGameState = () => {
    const saved = localStorage.getItem('game');
    if (saved) {
        const gameState = JSON.parse(saved);
        return gameState.board;
    }
    return null;
};

const HEADERS = ["Username", "Score", "Submission Date"];
var BOARD = loadGameState() || [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

const createBoard = () => {
    const main = document.querySelector('main');

    const section = createElement({ tag: 'section', className: 'boardSection' })

    main.appendChild(section);

    addNumbersBoard();
    if (isBoardEmpty()) {
        updateBoard();
        updateBoard();
        saveCurrentState();
    }
};

const addNumbersBoard = () => {
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

const leadersModal = () => {
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

const updateBoard = () => {
    const num = generateNumsGrid();
    const row = num.row;
    const col = num.col;
    const values = [2, 4];

    if (BOARD[row][col] == 0) {
        BOARD[row][col] = values[Math.floor(Math.random() * values.length)];
    }
}

const saveCurrentState = () => {
    localStorage.setItem('game', JSON.stringify({ board: BOARD }));
};

const isBoardEmpty = () => {
    return BOARD.every(row => row.every(cell => cell == 0));
};

document.addEventListener("DOMContentLoaded", function () {
    createBoard();
    leadersModal();
});