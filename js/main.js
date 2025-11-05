document.addEventListener("DOMContentLoaded", function () {

    const HEADERS = ['№', "Username", "Score"];
    var BOARD = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    const createBoard = () => {
        const main = document.querySelector('main');
        const section = document.createElement('section');
        section.className = 'boardSection';
        main.appendChild(section);
        updateBoard();
        updateBoard();
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

                const numberText = document.createTextNode(cell === 0 ? '' : cell.toString());
                cellElement.appendChild(numberText);

                boardContainer.appendChild(cellElement);
            });
        });

        boardSection.appendChild(boardContainer);
    };

    const createResultsTable = () => {
        const main = document.querySelector('main');

        const div = document.createElement('div');
        div.className = 'tableResultsContainer';

        const title = document.createElement('h2');
        title.textContent = 'Leaderboard';
        div.appendChild(title);

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

        main.appendChild(div);
    };

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

    createBoard();
    createResultsTable();
    addNumbersBoard();
});