import { getBoard, getScore } from './state.js'
import { newGame } from './game.js'
import { createElement } from './elements.js'

const isGameOver = () => {
    const board = getBoard();

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) return false;
            if (j < 3 && board[i][j] === board[i][j + 1]) return false;
            if (i < 3 && board[i][j] === board[i + 1][j]) return false;
        }
    }
    return true;
}

const hasWon = () => {
    return getBoard().some(row => row.some(cell => cell === 2048));
}

export const checkGameStatus = () => {
    const score = getScore();

    if (hasWon()) {
        showGameMessage("You reached 2048!", "win", score);
        return true;
    }

    if (isGameOver()) {
        showGameMessage("Game Over!", "lose", score);
        return true;
    }

    return false;
}

const getLeaderboard = () => {
    const leaders = localStorage.getItem('leaderboard');
    return leaders ? JSON.parse(leaders) : [];
};

const saveToLeaderboard = (name, score) => {
    const leaders = getLeaderboard();
    const newRecord = {
        name: name.trim(),
        score: score,
        date: new Date().toLocaleDateString('ru-RU')
    };

    leaders.push(newRecord);
    leaders.sort((a, b) => b.score - a.score);
    const topLeaders = leaders.slice(0, 10);

    localStorage.setItem('leaderboard', JSON.stringify(topLeaders));
};

const showGameMessage = (message, type, score = 0) => {

    const main = document.querySelector('main');

    let messageElement = document.getElementById('game-message');

    if (!messageElement) {
        messageElement = createElement({
            tag: 'div',
            id: 'game-message',
            className: `game-message game-message-${type}`
        });
        document.body.appendChild(messageElement);
    } else {
        while (messageElement.firstChild) {
            messageElement.removeChild(messageElement.firstChild);
        }
        messageElement.className = `game-message game-message-${type}`;
    }

    const messageDiv = createElement({ tag: 'div', className: 'game-message-text', text: message });

    const scoreDiv = createElement({ tag: 'div', className: 'game-message-score', text: `Your Score: ${score}` });

    const inputSection = createElement({ tag: 'div', className: 'name-input-section' });

    const nameInput = createElement({
        tag: 'input',
        className: 'name-input',
        attributes: {
            type: 'text',
            placeholder: 'Enter your username',
            required: true
        }
    });

    const buttonsDiv = createElement({ tag: 'div', className: 'game-message-buttons' });

    const saveButton = createElement({
        tag: 'button',
        type: 'submit',
        className: 'save-button',
        text: 'Save',
        events: {
            click: (event) => {
                event.preventDefault();
                const playerName = nameInput.value.trim();
                if (!playerName) {
                    nameInput.classList.add('input-error');
                    nameInput.placeholder = 'Please enter your username!';
                    return;
                }
                saveToLeaderboard(playerName, score);
                updateLeaders();
                showTemporaryMessage('Score saved!', messageElement);
                newGame();
            }
        }
    });

    const restartButton = createElement({
        tag: 'button',
        className: 'restart-button',
        text: 'New Game',
        events: {
            click: () => {
                newGame();
                messageElement.classList.add('hidden');
            }
        }
    });

    inputSection.appendChild(nameInput);
    buttonsDiv.append(saveButton, restartButton);

    messageElement.append(messageDiv, scoreDiv, inputSection, buttonsDiv);
    main.append(messageElement);

    setTimeout(() => nameInput.focus(), 100);

    messageElement.classList.remove('hidden');
};

const showTemporaryMessage = (message, originalMessageElement) => {
    const tempMessage = createElement({ tag: 'div', className: 'game-message game-message-saved' });

    const messageDiv = createElement({ tag: 'div', className: 'game-message-text', text: message });

    tempMessage.appendChild(messageDiv);
    document.body.appendChild(tempMessage);

    originalMessageElement.classList.add('hidden');

    setTimeout(() => tempMessage.remove(), 2000);
};

export const updateLeaders = () => {
    const tbody = document.getElementById("results-tbody");
    const leaders = getLeaderboard();

    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    leaders.forEach(record => {
        const row = createElement({ tag: 'tr' });

        const nameCell = createElement({ tag: 'td', text: record.name });

        const scoreCell = createElement({ tag: 'td', text: record.score.toString() });

        const dateCell = createElement({ tag: 'td', text: record.date });

        row.append(nameCell, scoreCell, dateCell);
        tbody.appendChild(row);
    });
};