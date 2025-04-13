// src/core/rules.js
import { Piece } from './pieces.js';
import { Board } from './board.js';
import GameState from './gameState.js';

export class Rules {
  isValidMove(piece, fromRow, fromCol, toRow, toCol, board) {
    if (!board.isValidPosition(fromRow, fromCol) || !board.isValidPosition(toRow, toCol)) {
      return false;
    }
    if (!piece || (board.getPiece(toRow, toCol)?.player === piece.player)) {
      return false;
    }

    const pieceObj = new Piece(piece.type, piece.player);
    const moves = pieceObj.getValidMoves(fromRow, fromCol, board);

    if (!moves.some(([r, c]) => r === toRow && c === toCol)) {
      return false;
    }

    if (['queen', 'bishop', 'rook'].includes(piece.type)) {
      return this.isPathClear(fromRow, fromCol, toRow, toCol, board);
    }

    return true;
  }

  isPathClear(fromRow, fromCol, toRow, toCol, board) {
    const dr = toRow - fromRow;
    const dc = toCol - fromCol;
    const stepRow = dr === 0 ? 0 : dr / Math.abs(dr);
    const stepCol = dc === 0 ? 0 : dc / Math.abs(dc);
    let r = fromRow + stepRow;
    let c = fromCol + stepCol;
    while (r !== toRow || c !== toCol) {
      if (!board.isValidPosition(r, c) || board.getPiece(r, c)) {
        return false;
      }
      r += stepRow;
      c += stepCol;
    }
    return true;
  }

  getPossibleMoves(piece, row, col, board) {
    if (!piece) return [];
    const pieceObj = new Piece(piece.type, piece.player);
    const moves = pieceObj.getValidMoves(row, col, board);
    return moves.filter(([r, c]) => this.isValidMove(piece, row, col, r, c, board));
  }
}