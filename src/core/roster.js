// src/core/roster.js
import GameState from './gameState.js';

export class Roster {
  addPiece(type, player) {
    const boardSize = GameState.getBoardSize();
    const nextBoardSize = boardSize + (GameState.isFirstRound() ? 0 : 1);
    let targetRow = 0;
    let targetCol = 0;
    const pieces = player === 'player' ? GameState.getPlayerPieces() : GameState.getAIPieces();
    const row0Cols = pieces.filter(p => p.row === 0).map(p => p.col).sort((a, b) => a - b);
    while (row0Cols.includes(targetCol) && targetCol < nextBoardSize) {
      targetCol++;
    }
    if (targetCol >= nextBoardSize) {
      targetRow = 1;
      targetCol = 0;
      const row1Cols = pieces.filter(p => p.row === 1).map(p => p.col).sort((a, b) => a - b);
      while (row1Cols.includes(targetCol) && targetCol < nextBoardSize) {
        targetCol++;
      }
      if (targetCol >= nextBoardSize) {
        return false;
      }
    }
    pieces.push({ type, col: targetCol, row: targetRow });
    if (player === 'player') {
      GameState.setPlayerPieces(pieces);
    } else {
      GameState.setAIPieces(pieces);
    }
    return true;
  }

  sellPiece(row, col, player) {
    const pieces = player === 'player' ? GameState.getPlayerPieces() : GameState.getAIPieces();
    const pieceIndex = pieces.findIndex(p => p.row === row && p.col === col);
    if (pieceIndex === -1 || pieces[pieceIndex].type === 'king') {
      return { success: false };
    }
    const piece = pieces[pieceIndex];
    const sellValue = Math.floor(GameState.getPieceValues()[piece.type] / 2);
    pieces.splice(pieceIndex, 1);
    if (player === 'player') {
      GameState.setPlayerPieces(pieces);
      GameState.setGold(GameState.getGold() + sellValue);
    } else {
      GameState.setAIPieces(pieces);
      GameState.setAIGold(GameState.getAIGold() + sellValue);
    }
    return { success: true, sellValue };
  }

  rearrangePieces(player, fromRow, fromCol, toRow, toCol) {
    const pieces = player === 'player' ? GameState.getPlayerPieces() : GameState.getAIPieces();
    const nextBoardSize = GameState.getBoardSize() + (GameState.isFirstRound() ? 0 : 1);
    if (toCol >= nextBoardSize) {
      return false;
    }
    const sourceIndex = pieces.findIndex(p => p.row === fromRow && p.col === fromCol);
    const targetIndex = pieces.findIndex(p => p.row === toRow && p.col === toCol);
    if (sourceIndex === -1) {
      return false;
    }
    if (targetIndex === -1) {
      pieces[sourceIndex].row = toRow;
      pieces[sourceIndex].col = toCol;
    } else {
      pieces[sourceIndex].row = pieces[targetIndex].row;
      pieces[sourceIndex].col = pieces[targetIndex].col;
      pieces[targetIndex].row = fromRow;
      pieces[targetIndex].col = fromCol;
    }
    if (player === 'player') {
      GameState.setPlayerPieces(pieces);
    } else {
      GameState.setAIPieces(pieces);
    }
    return true;
  }
}