import { BOARD } from "./data.js";

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

export const initialState = loadGameState();

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