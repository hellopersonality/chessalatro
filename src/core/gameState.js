// src/core/gameState.js
let state = {
  boardSize: 4,
  playerTurn: true,
  round: 1,
  firstRound: true,
  gold: 5,
  aiGold: 5,
  playerPieces: [{ type: 'king', row: 0, col: 2, player: 'player' }],
  aiPieces: [{ type: 'king', row: 1, col: 2, player: 'ai' }],
  selectedPiece: null,
  packs: null,
  currentPackType: null,
  shopPacks: null,
  permadeath: false,
};

export default {
  getBoardSize() { return state.boardSize; },
  setBoardSize(size) { state.boardSize = size; },
  isPlayerTurn() { return state.playerTurn; },
  setPlayerTurn(turn) { state.playerTurn = turn; },
  getRound() { return state.round; },
  incrementRound() { state.round++; },
  isFirstRound() { return state.firstRound; },
  setFirstRound(value) { state.firstRound = value; },
  getGold() { return state.gold; },
  setGold(value) {
    console.log(`Setting gold to ${value}, previous value: ${state.gold}`);
    state.gold = Math.max(0, value);
  },
  getAIGold() { return state.aiGold; },
  setAIGold(value) { state.aiGold = Math.max(0, value); },
  getPlayerPieces() { return state.playerPieces; },
  getAIPieces() { return state.aiPieces; },
  addPiece(piece, owner) {
    if (owner === 'player') {
      state.playerPieces.push(piece);
    } else {
      state.aiPieces.push(piece);
    }
  },
  removePiece(row, col, owner) {
    if (owner === 'player') {
      state.playerPieces = state.playerPieces.filter(p => p.row !== row || p.col !== col);
    } else {
      state.aiPieces = state.aiPieces.filter(p => p.row !== row || p.col !== col);
    }
  },
  setAllPieces(pieces, owner) {
    if (owner === 'player') {
      state.playerPieces = pieces;
    } else {
      state.aiPieces = pieces;
    }
  },
  selectPiece(row, col) { state.selectedPiece = { row, col }; },
  getSelectedPiece() { return state.selectedPiece; },
  clearSelectedPiece() { state.selectedPiece = null; },
  getPacks() { return state.packs; },
  setPacks(packs) { state.packs = packs; },
  getCurrentPackType() { return state.currentPackType; },
  setCurrentPackType(type) { state.currentPackType = type; },
  getShopPacks() { return state.shopPacks; },
  setShopPacks(packs) { state.shopPacks = packs; },
  isPermadeath() { return state.permadeath; },
  setPermadeathMode(value) { state.permadeath = value; },
  getPieceValues() {
    return {
      pawn: 1,
      knight: 3,
      bishop: 3,
      rook: 5,
      queen: 9,
      king: 100,
    };
  },
  reset() {
    state = {
      boardSize: 4,
      playerTurn: true,
      round: 1,
      firstRound: true,
      gold: 5,
      aiGold: 5,
      playerPieces: [{ type: 'king', row: 0, col: 2, player: 'player' }],
      aiPieces: [{ type: 'king', row: 1, col: 2, player: 'ai' }],
      selectedPiece: null,
      packs: null,
      currentPackType: null,
      shopPacks: null,
      permadeath: false,
    };
  },
};