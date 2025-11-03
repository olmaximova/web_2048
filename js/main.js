document.addEventListener("DOMContentLoaded", function () {

    const HEADERS = ['№', "Username", "Score"];

    const createBoard = () => {
        const body = document.querySelector('body');
        const section = document.createElement('section');
        section.className = 'boardSection';
        body.appendChild(section);
    };

    const createResultsTable = () => {
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

        document.body.appendChild(div);
    };

    createBoard();
    createResultsTable();
});