import { BOARD } from "./data.js";

export const loadGameState = () => {
    const saved = localStorage.getItem('gameState');
    if (saved) {
        const gameState = JSON.parse(saved);
        return {
            board: gameState.board || BOARD,
            gameStarted: gameState.gameStarted || false,
            score: gameState.score || 0,
            history: gameState.history || []
        };
    }
    return {
        board: BOARD,
        gameStarted: false,
        score: 0,
        history: []
    };
};

export const initialState = loadGameState();

export const gameState = {
    board: initialState.board,
    started: initialState.gameStarted,
    score: initialState.score,
    history: initialState.history
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
export const getHistory = () => gameState.history;

export const saveGameState = () => {
    const gameState = {
        board: getBoard(),
        gameStarted: getGameStarted(),
        score: getScore(),
        history: getHistory(),
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

export const resetBoard = () => {
    gameState.board = JSON.parse(JSON.stringify(BOARD));
    gameState.started = false;
    gameState.score = 0;
    saveGameState();
};