// src/core/board.js
import GameState from './gameState.js';

export class Board {
  constructor() {
    this.board = GameState.getBoard();
  }

  initialize(size) {
    this.board = Array(size)
      .fill(null)
      .map(() => Array(size).fill(null));
    GameState.setBoard(this.board);
  }

  isValidPosition(row, col) {
    const size = GameState.getBoardSize();
    return row >= 0 && row < size && col >= 0 && col < size;
  }

  getPiece(row, col) {
    return this.board[row][col] ? { ...this.board[row][col] } : null;
  }

  setPiece(row, col, piece) {
    this.board[row][col] = piece ? { ...piece } : null;
    GameState.setBoard(this.board);
  }

  movePiece(fromRow, fromCol, toRow, toCol) {
    const piece = this.getPiece(fromRow, fromCol);
    if (!piece) return;

    const target = this.getPiece(toRow, toCol);
    const pieceValues = GameState.getPieceValues();

    if (target) {
      if (target.player === 'player') {
        GameState.setAIGold(GameState.getAIGold() + pieceValues[target.type]);
        if (GameState.isPermadeathMode()) {
          let rosterRow = toRow === GameState.getBoardSize() - 1 ? 1 : toRow === GameState.getBoardSize() - 2 ? 0 : -1;
          if (target.type === 'king') rosterRow = 0;
          const rosterCol = toCol;
          const playerPieces = GameState.getPlayerPieces();
          const pieceIndex = playerPieces.findIndex(p => p.row === rosterRow && p.col === rosterCol && p.type === target.type);
          if (pieceIndex !== -1) {
            GameState.setPlayerPieces(playerPieces.filter((_, i) => i !== pieceIndex));
          } else {
            const fallbackIndex = playerPieces.findIndex(p => p.type === target.type);
            if (fallbackIndex !== -1) {
              GameState.setPlayerPieces(playerPieces.filter((_, i) => i !== fallbackIndex));
            }
          }
        }
      } else {
        GameState.setGold(GameState.getGold() + pieceValues[target.type]);
      }
    }

    this.board[toRow][toCol] = { ...piece, hasMoved: true };
    this.board[fromRow][fromCol] = null;

    if (piece.type === 'pawn') {
      if (piece.player === 'player' && toRow === 0) {
        this.board[toRow][toCol].type = 'queen';
        const playerPieces = GameState.getPlayerPieces();
        const pieceIndex = playerPieces.findIndex(
          p => p.row === (fromRow === GameState.getBoardSize() - 1 ? 1 : 0) && p.col === fromCol
        );
        if (pieceIndex !== -1) {
          playerPieces[pieceIndex].type = 'queen';
          GameState.setPlayerPieces(playerPieces);
        }
      } else if (piece.player === 'ai' && toRow === GameState.getBoardSize() - 1) {
        this.board[toRow][toCol].type = 'queen';
      }
    }

    GameState.setBoard(this.board);
  }

  getState() {
    return this.board.map(row => [...row]);
  }
}