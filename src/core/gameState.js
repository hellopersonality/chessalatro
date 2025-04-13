// src/core/gameState.js (updated)
import { config } from './config.js';

class GameState {
  #boardSize = config.initialBoardSize;
  #board = [];
  #playerTurn = true;
  #selectedPiece = null;
  #gold = 5;
  #aiGold = 5;
  #round = 1;
  #playerPieces = [];
  #aiPieces = [];
  #firstRound = true;
  #permadeathMode = false;
  #currentPackType = null;
  #selectionsRemaining = 1;
  #shopPacks = { pack1: 'basic', pack2: 'middle', pack3: 'ultra' };

  constructor() {
    this.reset();
  }

  reset() {
    this.#boardSize = config.initialBoardSize;
    this.#board = Array(this.#boardSize)
      .fill(null)
      .map(() => Array(this.#boardSize).fill(null));
    this.#playerPieces = [{ type: 'king', col: 0, row: 0 }];
    this.#aiPieces = [{ type: 'king', col: Math.floor(Math.random() * this.#boardSize), row: 1 }];
    this.#gold = 5;
    this.#aiGold = 5;
    this.#round = 1;
    this.#playerTurn = true;
    this.#selectedPiece = null;
    this.#firstRound = true;
    this.#permadeathMode = false;
    this.#currentPackType = null;
    this.#selectionsRemaining = 1;
    this.#shopPacks = { pack1: 'basic', pack2: 'middle', pack3: 'ultra' };
  }

  // Getters
  getBoardSize() {
    return this.#boardSize;
  }

  getBoard() {
    return this.#board.map(row => [...row]);
  }

  isPlayerTurn() {
    return this.#playerTurn;
  }

  getSelectedPiece() {
    return this.#selectedPiece ? { ...this.#selectedPiece } : null;
  }

  getGold() {
    return this.#gold;
  }

  getAIGold() {
    return this.#aiGold;
  }

  getRound() {
    return this.#round;
  }

  getPlayerPieces() {
    return [...this.#playerPieces];
  }

  getAIPieces() {
    return [...this.#aiPieces];
  }

  isFirstRound() {
    return this.#firstRound;
  }

  isPermadeathMode() {
    return this.#permadeathMode;
  }

  getCurrentPackType() {
    return this.#currentPackType;
  }

  getSelectionsRemaining() {
    return this.#selectionsRemaining;
  }

  getPieceValues() {
    return { ...config.pieceValues };
  }

  getPieceTypes() {
    return [...config.pieceTypes];
  }

  getPacks() {
    return { ...config.packs };
  }

  getShopPacks() {
    return { ...this.#shopPacks };
  }

  // Setters
  setBoardSize(size) {
    this.#boardSize = size;
    this.#board = Array(size)
      .fill(null)
      .map(() => Array(size).fill(null));
  }

  setBoard(board) {
    this.#board = board.map(row => [...row]);
  }

  setPlayerTurn(turn) {
    this.#playerTurn = turn;
  }

  selectPiece(row, col) {
    this.#selectedPiece = { row, col };
  }

  clearSelectedPiece() {
    this.#selectedPiece = null;
  }

  setGold(amount) {
    this.#gold = Math.max(0, amount);
  }

  setAIGold(amount) {
    this.#aiGold = Math.max(0, amount);
  }

  incrementRound() {
    this.#round += 1;
  }

  setPlayerPieces(pieces) {
    this.#playerPieces = [...pieces];
  }

  setAIPieces(pieces) {
    this.#aiPieces = [...pieces];
  }

  setFirstRound(value) {
    this.#firstRound = value;
  }

  setPermadeathMode(mode) {
    this.#permadeathMode = mode;
  }

  setCurrentPackType(type) {
    this.#currentPackType = type;
  }

  setSelectionsRemaining(count) {
    this.#selectionsRemaining = count;
  }

  setShopPacks(packs) {
    this.#shopPacks = { ...packs };
  }
}

export default new GameState();