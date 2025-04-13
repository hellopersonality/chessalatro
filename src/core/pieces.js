// src/core/pieces.js
import { Board } from './board.js';

export class Piece {
  constructor(type, player) {
    this.type = type;
    this.player = player;
    this.hasMoved = false;
  }

  getValidMoves(fromRow, fromCol, board) {
    const moves = [];
    const boardSize = board.board[0].length;

    if (this.type === 'pawn') {
      const dir = this.player === 'player' ? -1 : 1;
      if (board.isValidPosition(fromRow + dir, fromCol) && !board.getPiece(fromRow + dir, fromCol)) {
        moves.push([fromRow + dir, fromCol]);
      }
      if (
        !this.hasMoved &&
        board.isValidPosition(fromRow + 2 * dir, fromCol) &&
        !board.getPiece(fromRow + dir, fromCol) &&
        !board.getPiece(fromRow + 2 * dir, fromCol)
      ) {
        moves.push([fromRow + 2 * dir, fromCol]);
      }
      if (
        board.isValidPosition(fromRow + dir, fromCol - 1) &&
        board.getPiece(fromRow + dir, fromCol - 1) &&
        board.getPiece(fromRow + dir, fromCol - 1).player !== this.player
      ) {
        moves.push([fromRow + dir, fromCol - 1]);
      }
      if (
        board.isValidPosition(fromRow + dir, fromCol + 1) &&
        board.getPiece(fromRow + dir, fromCol + 1) &&
        board.getPiece(fromRow + dir, fromCol + 1).player !== this.player
      ) {
        moves.push([fromRow + dir, fromCol + 1]);
      }
    } else if (this.type === 'king') {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const r = fromRow + dr;
          const c = fromCol + dc;
          if (board.isValidPosition(r, c)) {
            moves.push([r, c]);
          }
        }
      }
    } else if (this.type === 'knight') {
      const knightMoves = [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1],
      ];
      for (const [dr, dc] of knightMoves) {
        const r = fromRow + dr;
        const c = fromCol + dc;
        if (board.isValidPosition(r, c)) {
          moves.push([r, c]);
        }
      }
    } else if (this.type === 'queen' || this.type === 'rook' || this.type === 'bishop') {
      const directions = [];
      if (this.type === 'queen' || this.type === 'rook') {
        directions.push([0, 1], [0, -1], [1, 0], [-1, 0]); // Horizontal/Vertical
      }
      if (this.type === 'queen' || this.type === 'bishop') {
        directions.push([1, 1], [1, -1], [-1, 1], [-1, -1]); // Diagonal
      }
      for (const [dr, dc] of directions) {
        let r = fromRow + dr;
        let c = fromCol + dc;
        while (board.isValidPosition(r, c)) {
          moves.push([r, c]);
          if (board.getPiece(r, c)) break;
          r += dr;
          c += dc;
        }
      }
    }

    return moves;
  }
}