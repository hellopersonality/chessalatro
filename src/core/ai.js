// src/core/ai.js
import GameState from './gameState.js';
import Config from './config.js'; // Should match the default export

export class AI {
  buyPack() {
    const round = GameState.getRound();
    const packType = round <= 3 ? 'basic' : round <= 6 ? 'advanced' : 'expert';
    const pack = Config.shop.packs[packType];
    if (!pack) return [];
    return pack.pieces;
  }

  rearrangePieces() {
    const aiPieces = GameState.getAIPieces();
    const shuffled = aiPieces.sort(() => Math.random() - 0.5);
    GameState.setAllPieces(shuffled, 'ai');
  }

  makeMove(game) {
    const aiPieces = GameState.getAIPieces();
    const board = game.board;
    const rules = game.rules;

    for (const piece of aiPieces) {
      const moves = rules.getPossibleMoves(piece, piece.row, piece.col, board);
      if (moves.length > 0) {
        const [toRow, toCol] = moves[Math.floor(Math.random() * moves.length)];
        game.handleMove(piece.row, piece.col, toRow, toCol);
        return;
      }
    }

    game.state.setPlayerTurn(true);
    game.showShop();
  }
}