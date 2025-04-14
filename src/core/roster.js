// src/core/roster.js
import GameState from './gameState.js';

export class Roster {
  addPiece(type, owner) {
    const pieces = owner === 'player' ? GameState.getPlayerPieces() : GameState.getAIPieces();
    const row = pieces.length < 5 ? 0 : 1;
    const col = pieces.length < 5 ? pieces.length : pieces.length - 5;
    if (row < 2 && col < 5) {
      GameState.addPiece({ type, row, col, player: owner }, owner);
      return true;
    }
    return false;
  }

  sellPiece(row, col, owner) {
    const pieces = owner === 'player' ? GameState.getPlayerPieces() : GameState.getAIPieces();
    const piece = pieces.find(p => p.row === row && p.col === col);
    if (!piece) return { success: false };
    const sellValue = Math.floor(GameState.getPieceValues()[piece.type] / 2);
    GameState.removePiece(row, col, owner);
    if (owner === 'player') {
      GameState.setGold(GameState.getGold() + sellValue);
    } else {
      GameState.setAIGold(GameState.getAIGold() + sellValue);
    }
    return { success: true, sellValue };
  }

  rearrangePieces(owner, fromRow, fromCol, toRow, toCol) {
    const pieces = owner === 'player' ? GameState.getPlayerPieces() : GameState.getAIPieces();
    const piece = pieces.find(p => p.row === fromRow && p.col === fromCol);
    const targetPiece = pieces.find(p => p.row === toRow && p.col === toCol);
    if (!piece || (targetPiece && targetPiece.type === 'king')) return false;
    piece.row = toRow;
    piece.col = toCol;
    if (targetPiece) {
      targetPiece.row = fromRow;
      targetPiece.col = fromCol;
    }
    return true;
  }
}