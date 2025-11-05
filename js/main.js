document.addEventListener("DOMContentLoaded", function () {

    const loadGameState = () => {
        const saved = localStorage.getItem('game');
        if (saved) {
            const gameState = JSON.parse(saved);
            return gameState.board;
        }
        return null;
    };

    const HEADERS = ['№', "Username", "Score"];
    var BOARD = loadGameState() || [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    const createBoard = () => {
        const main = document.querySelector('main');
        const section = document.createElement('section');
        section.className = 'boardSection';
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

        const boardContainer = document.createElement('div');
        boardContainer.className = 'numContainer';

        BOARD.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellElement = document.createElement('div');
                cellElement.className = 'numCell';
                cellElement.dataset.row = rowIndex;
                cellElement.dataset.col = colIndex;

                if (cell !== 0) {
                    const tile = document.createElement('div');
                    tile.className = 'tile';
                    tile.textContent = cell.toString();
                    tile.setAttribute('data-value', cell.toString());
                    cellElement.appendChild(tile);
                }

                boardContainer.appendChild(cellElement);
            });
        });

        boardSection.appendChild(boardContainer);
    };

    const createResultsTable = () => {
        const div = document.createElement('div');
        div.className = 'tableResultsContainer';

        const table = document.createElement('table');
        table.className = 'tableResults';

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        const tbody = document.createElement("tbody");
        tbody.id = "results-tbody";

        HEADERS.forEach((header) => {
            const th = document.createElement("th");
            th.textContent = header;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.append(thead, tbody);
        div.appendChild(table);

        return div;
    };

    const leadersModal = () => {
        const main = document.querySelector('main');

        const modal = document.createElement('section');
        modal.className = 'modalResultsLeaders';
        modal.style.display = 'none';

        const content = document.createElement('div');
        content.className = 'modalContent';

        const modalHeader = document.createElement('div');
        modalHeader.className = 'modalHeader';

        const title = document.createElement('h2');
        title.textContent = 'Leaderboard';

        const closeBtn = document.createElement('span');
        closeBtn.className = 'closeBtn';
        closeBtn.textContent = 'x'; 

        closeBtn.addEventListener('click', () => openCloseModal('close'));
        document.getElementById('leadersBtn').addEventListener('click', () => openCloseModal('open'));
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                openCloseModal('close');
            }
        });

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

    createBoard();
    leadersModal();
});