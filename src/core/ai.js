// src/core/ai.js
import GameState from './gameState.js';
import { Rules } from './rules.js';
import { Board } from './board.js';
import { Shop } from './shop.js';
import { Roster } from './roster.js';

export class AI {
  constructor() {
    this.rules = new Rules();
    this.board = new Board();
    this.shop = new Shop();
    this.roster = new Roster();
  }

  makeMove(game) {
    const allMoves = [];
    const board = this.board.getState();
    for (let i = 0; i < GameState.getBoardSize(); i++) {
      for (let j = 0; j < GameState.getBoardSize(); j++) {
        if (board[i][j] && board[i][j].player === 'ai') {
          const moves = this.rules.getPossibleMoves(board[i][j], i, j, this.board);
          for (let [toRow, toCol] of moves) {
            const score = this.evaluateMoveWithMinimax(i, j, toRow, toCol);
            allMoves.push({ fromRow: i, fromCol: j, toRow, toCol, score });
          }
        }
      }
    }

    if (allMoves.length === 0) {
      GameState.setPlayerTurn(true);
      return;
    }

    allMoves.sort((a, b) => b.score - a.score);
    const bestMoves = allMoves.slice(0, Math.max(1, Math.floor(allMoves.length * 0.2)));
    const chosenMove = Math.random() < 0.8 ? bestMoves[0] : bestMoves[Math.floor(Math.random() * bestMoves.length)];
    game.handleMove(chosenMove.fromRow, chosenMove.fromCol, chosenMove.toRow, chosenMove.toCol);
  }

  evaluateMoveWithMinimax(fromRow, fromCol, toRow, toCol) {
    const aiScore = this.evaluateMove(fromRow, fromCol, toRow, toCol);
    const board = this.board.getState();
    const originalPiece = board[toRow][toCol];
    const movingPiece = board[fromRow][fromCol];
    board[toRow][toCol] = movingPiece;
    board[fromRow][fromCol] = null;

    let opponentBestScore = -Infinity;
    for (let i = 0; i < GameState.getBoardSize(); i++) {
      for (let j = 0; j < GameState.getBoardSize(); j++) {
        if (board[i][j] && board[i][j].player === 'player') {
          const moves = this.rules.getPossibleMoves(board[i][j], i, j, this.board);
          for (let [oppToRow, oppToCol] of moves) {
            const oppScore = this.evaluateMove(i, j, oppToRow, oppToCol);
            opponentBestScore = Math.max(opponentBestScore, oppScore);
          }
        }
      }
    }

    board[fromRow][fromCol] = movingPiece;
    board[toRow][toCol] = originalPiece;

    return aiScore - (opponentBestScore === -Infinity ? 0 : opponentBestScore * 0.5);
  }

  evaluateMove(fromRow, fromCol, toRow, toCol) {
    let score = 0;
    const board = this.board.getState();
    const piece = board[fromRow][fromCol];
    const target = board[toRow][toCol];
    const pieceValues = GameState.getPieceValues();

    if (target && target.player === 'player') {
      score += pieceValues[target.type] * 10;
      if (target.type === 'king') score += 1000;
      if (pieceValues[target.type] >= 5 && piece.type === 'king') {
        score -= 100;
      }
    }

    const centerCols = [Math.floor(GameState.getBoardSize() / 2) - 1, Math.floor(GameState.getBoardSize() / 2)];
    if (centerCols.includes(toCol)) score += 5;

    const tempBoard = board.map(row => [...row]);
    tempBoard[toRow][toCol] = tempBoard[fromRow][fromCol];
    tempBoard[fromRow][fromCol] = null;
    const newMoves = this.rules.getPossibleMoves(tempBoard[toRow][toCol], toRow, toCol, this.board);
    score += newMoves.length * 3;

    let aiKingPos = null;
    for (let i = 0; i < GameState.getBoardSize(); i++) {
      for (let j = 0; j < GameState.getBoardSize(); j++) {
        if (tempBoard[i][j] && tempBoard[i][j].player === 'ai' && tempBoard[i][j].type === 'king') {
          aiKingPos = { row: i, col: j };
          break;
        }
      }
      if (aiKingPos) break;
    }
    if (aiKingPos) {
      for (let i = 0; i < GameState.getBoardSize(); i++) {
        for (let j = 0; j < GameState.getBoardSize(); j++) {
          if (tempBoard[i][j] && tempBoard[i][j].player === 'player') {
            if (this.rules.isValidMove(tempBoard[i][j], i, j, aiKingPos.row, aiKingPos.col, this.board)) {
              score -= 100;
            }
          }
        }
        if (piece.type !== 'king' && Math.abs(toRow - aiKingPos.row) <= 1 && Math.abs(toCol - aiKingPos.col) <= 1) {
          score += 20;
        }
      }
    }

    if (piece.type === 'king') {
      score -= 10;
      const vulnerability = this.checkKingVulnerability(toRow, toCol, tempBoard);
      score -= vulnerability;
      if (!this.isKingThreatened(fromRow, fromCol, board) && this.isKingThreatened(toRow, toCol, tempBoard)) {
        score -= 50;
      }
      const playerThreatCols = GameState.getPlayerPieces()
        .filter(p => p.row === 1)
        .map(p => p.col);
      if (playerThreatCols.includes(toCol)) {
        score -= 30;
      }
    }

    for (let i = 0; i < GameState.getBoardSize(); i++) {
      for (let j = 0; j < GameState.getBoardSize(); j++) {
        if (tempBoard[i][j] && tempBoard[i][j].player === 'player') {
          if (this.rules.isValidMove(tempBoard[i][j], i, j, toRow, toCol, this.board)) {
            score -= pieceValues[tempBoard[toRow][toCol].type] * 5;
          }
        }
      }
    }

    score += (fromRow - toRow) * 2;

    return score;
  }

  checkKingVulnerability(toRow, toCol, boardState) {
    let vulnerabilityScore = 0;

    for (let i = 0; i < GameState.getBoardSize(); i++) {
      for (let j = 0; j < GameState.getBoardSize(); j++) {
        if (boardState[i][j] && boardState[i][j].player === 'player') {
          if (this.rules.isValidMove(boardState[i][j], i, j, toRow, toCol, this.board)) {
            vulnerabilityScore += 50;
          }
          const moves = this.rules.getPossibleMoves(boardState[i][j], i, j, this.board);
          moves.forEach(([mr, mc]) => {
            const tempBoard = boardState.map(row => [...row]);
            tempBoard[mr][mc] = tempBoard[i][j];
            tempBoard[i][j] = null;
            if (this.rules.isValidMove(tempBoard[mr][mc], mr, mc, toRow, toCol, this.board)) {
              vulnerabilityScore += 20;
            }
          });
        }
      }
    }

    if (toRow === 0 || toRow === GameState.getBoardSize() - 1 || toCol === 0 || toCol === GameState.getBoardSize() - 1) {
      vulnerabilityScore += 10;
    }

    let protectors = 0;
    for (let r = Math.max(0, toRow - 1); r <= Math.min(GameState.getBoardSize() - 1, toRow + 1); r++) {
      for (let c = Math.max(0, toCol - 1); c <= Math.min(GameState.getBoardSize() - 1, toCol + 1); c++) {
        if (boardState[r][c] && boardState[r][c].player === 'ai' && !(r === toRow && c === toCol)) {
          protectors++;
        }
      }
    }
    vulnerabilityScore -= protectors * 10;

    return vulnerabilityScore;
  }

  isKingThreatened(row, col, boardState) {
    for (let i = 0; i < GameState.getBoardSize(); i++) {
      for (let j = 0; j < GameState.getBoardSize(); j++) {
        if (boardState[i][j] && boardState[i][j].player === 'player') {
          if (this.rules.isValidMove(boardState[i][j], i, j, row, col, this.board)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  buyPack() {
    const nextBoardSize = GameState.getBoardSize();
    const rosterSpace = 2 * nextBoardSize - GameState.getAIPieces().length;
    const canAffordUltra = GameState.getAIGold() >= GameState.getPacks().ultra.cost;
    const canAffordMiddle = GameState.getAIGold() >= GameState.getPacks().middle.cost;

    if (rosterSpace < 2 && (canAffordUltra || canAffordMiddle)) {
      this.sellPiece();
    }

    const shopPacks = GameState.getShopPacks();
    const affordablePacks = Object.keys(shopPacks)
      .filter(packId => GameState.getPacks()[shopPacks[packId]].cost <= GameState.getAIGold())
      .map(packId => shopPacks[packId]);

    if (affordablePacks.length === 0) {
      return [];
    }

    let selectedPack = null;
    const playerThreat = this.getPlayerRosterThreat();
    const strategy =
      playerThreat > 50
        ? Math.random() < 0.6
          ? 'defensive'
          : 'balanced'
        : playerThreat > 20
        ? Math.random() < 0.6
        ? 'balanced'
        : 'aggressive'
        : Math.random() < 0.6
        ? 'aggressive'
        : 'balanced';

    const doublePacks = affordablePacks.filter(p => GameState.getPacks()[p].double);
    if (doublePacks.length > 0 && rosterSpace >= 2) {
      selectedPack = doublePacks.reduce(
        (best, current) => (GameState.getPacks()[current].cost > GameState.getPacks()[best].cost ? current : best),
        doublePacks[0]
      );
    } else {
      if (strategy === 'aggressive' && affordablePacks.includes('ultra')) {
        selectedPack = 'ultra';
      } else if (strategy === 'defensive' && affordablePacks.includes('basic')) {
        selectedPack = 'basic';
      } else if (strategy === 'balanced' && affordablePacks.includes('middle')) {
        selectedPack = 'middle';
      } else {
        selectedPack = affordablePacks[Math.floor(Math.random() * affordablePacks.length)];
      }
    }

    const pack = GameState.getPacks()[selectedPack];
    GameState.setAIGold(GameState.getAIGold() - pack.cost);

    const packPieces = [];
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * pack.pieces.length);
      packPieces.push(pack.pieces[randomIndex]);
    }

    const selections = pack.double ? 2 : 1;
    const selectedPieces = [];
    const pieceScores = packPieces.map(piece => {
      let score = GameState.getPieceValues()[piece];
      const playerPieceCounts = {};
      GameState.getPlayerPieces().forEach(p => (playerPieceCounts[p.type] = (playerPieceCounts[p.type] || 0) + 1));
      if (piece === 'knight' && playerPieceCounts.pawn >= 2) score += 5;
      if (piece === 'bishop' && playerPieceCounts.knight >= 2) score += 5;
      if (piece === 'rook' && playerPieceCounts.bishop >= 2) score += 5;
      if (piece === 'queen' && playerThreat > 50) score += 10;
      if (strategy === 'defensive' && piece === 'pawn') score += 5;
      return { piece, score };
    });
    pieceScores.sort((a, b) => b.score - a.score);

    for (let i = 0; i < Math.min(selections, pieceScores.length); i++) {
      if (this.roster.addPiece(pieceScores[i].piece, 'ai')) {
        selectedPieces.push(pieceScores[i].piece);
      }
    }

    return selectedPieces;
  }

  sellPiece() {
    const nextBoardSize = GameState.getBoardSize();
    const rosterSpace = 2 * nextBoardSize - GameState.getAIPieces().length;
    const canAffordUltra = GameState.getAIGold() >= GameState.getPacks().ultra.cost;
    const canAffordMiddle = GameState.getAIGold() >= GameState.getPacks().middle.cost;
    if (rosterSpace >= 2 && !canAffordUltra && !canAffordMiddle) return;

    const pieceCounts = {};
    GameState.getAIPieces().forEach(piece => {
      pieceCounts[piece.type] = (pieceCounts[piece.type] || 0) + 1;
    });

    const sellScores = GameState.getAIPieces().map((piece, index) => {
      if (piece.type === 'king') return { index, score: -Infinity };

      let score = -GameState.getPieceValues()[piece.type];
      const count = pieceCounts[piece.type];
      if (count > 2) score += 5 * (count - 2);
      if (piece.type === 'pawn' && count > 3) score += 10;
      if (canAffordUltra && GameState.getPieceValues()[piece.type] <= 3) score += 5;
      if (rosterSpace < 2) score += 10;

      return { index, score };
    });

    sellScores.sort((a, b) => b.score - a.score);
    const topScore = sellScores[0];

    if (topScore.score <= 0) return;

    const pieceIndex = topScore.index;
    const piece = GameState.getAIPieces()[pieceIndex];
    this.roster.sellPiece(piece.row, piece.col, 'ai');
  }

  getPlayerRosterThreat() {
    let threatScore = 0;
    let forwardPieces = 0;
    const pieceCounts = {};

    GameState.getPlayerPieces().forEach(piece => {
      pieceCounts[piece.type] = (pieceCounts[piece.type] || 0) + 1;
      if (piece.row === 1) {
        forwardPieces++;
        threatScore += GameState.getPieceValues()[piece.type] * 1.5;
      } else {
        threatScore += GameState.getPieceValues()[piece.type];
      }
    });

    if (pieceCounts.knight >= 2) threatScore += 10;
    if (pieceCounts.queen >= 1) threatScore += 20;
    if (pieceCounts.pawn >= 3) threatScore += 5;
    if (forwardPieces >= GameState.getPlayerPieces().length / 2) threatScore += 15;

    return threatScore;
  }

  rearrangePieces() {
    const nextBoardSize = GameState.getBoardSize();
    const newAIPieces = [];
    const row0Cols = new Set();
    const row1Cols = new Set();

    const playerThreat = this.getPlayerRosterThreat();
    const strategy = playerThreat > 50 ? 'defensive' : playerThreat > 20 ? 'balanced' : 'aggressive';

    const opponentThreats = GameState.getPlayerPieces().map(p => ({
      type: p.type,
      col: p.col,
      row: p.row === 0 ? GameState.getBoardSize() - 2 : GameState.getBoardSize() - 1,
    }));

    const king = GameState.getAIPieces().find(p => p.type === 'king');
    let kingPos = null;
    if (king) {
      const safePositions = [
        { row: 1, col: 0 },
        { row: 1, col: nextBoardSize - 1 },
        { row: 0, col: Math.floor(nextBoardSize / 2) },
        { row: 0, col: nextBoardSize - 1 },
      ].filter(p => p.col < nextBoardSize);
      const playerThreatCols = opponentThreats.map(p => p.col);
      const bestSafePos = safePositions
        .map(pos => ({
          ...pos,
          threat: playerThreatCols.includes(pos.col) ? 10 : 0,
        }))
        .sort((a, b) => a.threat - b.threat)[0];
      kingPos = bestSafePos;
      newAIPieces.push({ type: 'king', row: kingPos.row, col: kingPos.col });
      if (kingPos.row === 0) row0Cols.add(kingPos.col);
      else row1Cols.add(kingPos.col);
    }

    const sortedPieces = GameState.getAIPieces()
      .filter(p => p.type !== 'king')
      .sort((a, b) => GameState.getPieceValues()[b.type] - GameState.getPieceValues()[a.type]);
    for (const piece of sortedPieces) {
      const slots = [];
      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < nextBoardSize; col++) {
          if ((row === 0 && row0Cols.has(col)) || (row === 1 && row1Cols.has(col))) continue;
          let score = 0;

          const centerCols = [Math.floor(nextBoardSize / 2) - 1, Math.floor(nextBoardSize / 2)];
          if (centerCols.includes(col)) score += 10;

          if (strategy === 'aggressive') {
            if (piece.type === 'knight' || piece.type === 'bishop') {
              if (row === 0) score += 15;
            } else if (piece.type === 'rook' || piece.type === 'queen') {
              if (row === 1) score += 10;
            }
          } else if (strategy === 'defensive' && kingPos) {
            if (piece.type === 'pawn' || piece.type === 'knight') {
              if (Math.abs(row - kingPos.row) <= 1 && Math.abs(col - kingPos.col) <= 1) {
                score += 20;
              }
            }
            if (row === 0 && piece.type === 'pawn') score += 10;
          } else if (strategy === 'balanced') {
            if (piece.type === 'pawn' && centerCols.includes(col)) score += 15;
            if ((piece.type === 'knight' || piece.type === 'bishop') && row === 0) score += 10;
            if ((piece.type === 'rook' || piece.type === 'queen') && row === 1) score += 5;
          }

          opponentThreats.forEach(opp => {
            if (opp.type === 'rook' || opp.type === 'queen') {
              if (opp.col === col && piece.type !== 'pawn') score -= 10;
            }
            if (opp.type === 'pawn' && piece.type === 'knight') score += 5;
            if (opp.type === 'knight' && piece.type === 'bishop') score += 5;
            if (opp.type === 'bishop' && piece.type === 'rook') score += 5;
          });

          slots.push({ row, col, score });
        }
      }

      if (slots.length === 0) continue;
      slots.sort((a, b) => b.score - a.score);
      const slot = slots[0];
      newAIPieces.push({ type: piece.type, row: slot.row, col: slot.col });
      if (slot.row === 0) row0Cols.add(slot.col);
      else row1Cols.add(slot.col);
    }

    GameState.setAIPieces(newAIPieces);
  }
}