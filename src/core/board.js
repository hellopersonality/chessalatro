// src/core/board.js
export class Board {
  constructor() {
    this.board = null; // Initialize as null; will be set by initialize()
  }

  initialize(size) {
    this.board = Array(size).fill().map(() => Array(size).fill(null));
  }

  getState() {
    return this.board;
  }

  getPiece(row, col) {
    if (this.isValidPosition(row, col)) {
      return this.board[row][col];
    }
    return null;
  }

  setPiece(row, col, piece) {
    if (this.isValidPosition(row, col)) {
      this.board[row][col] = piece;
    }
  }

  movePiece(fromRow, fromCol, toRow, toCol) {
    if (this.isValidPosition(fromRow, fromCol) && this.isValidPosition(toRow, toCol)) {
      const piece = this.board[fromRow][fromCol];
      if (piece) {
        piece.hasMoved = true;
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
      }
    }
  }

  isValidPosition(row, col) {
    return row >= 0 && row < this.board.length && col >= 0 && col < this.board[row].length;
  }
}