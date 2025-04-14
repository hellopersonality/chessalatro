// src/game.js
import GameState from './core/gameState.js';
import { Board } from './core/board.js';
import { Rules } from './core/rules.js';
import { Shop } from './core/shop.js';
import { Roster } from './core/roster.js';
import { AI } from './core/ai.js';
import { renderBoard, renderRoster } from './ui/renderer.js';
import { renderShop, renderPackSelection } from './ui/shopRenderer.js';
import { renderStatus } from './ui/statusRenderer.js';
import { animateShake, animateSlideIn, animateSlideOut, animateDropIn, animateDropOut } from './ui/animations.js';

export class Game {
  constructor(dom) {
    this.state = GameState;
    this.board = new Board();
    this.rules = new Rules();
    this.shop = new Shop();
    this.roster = new Roster();
    this.ai = new AI();
    this.dom = dom;
    this.pendingSell = null;
  }

  start(permadeath = false) {
    this.state.setPermadeathMode(permadeath);
    this.state.reset();
    this.board.initialize(this.state.getBoardSize());
    if (this.dom.introScreen) {
      animateSlideOut(this.dom.introScreen);
    }
    setTimeout(() => {
      if (this.dom.gameContainer) {
        this.dom.gameContainer.style.display = 'flex';
      }
      renderBoard(this.board.getState(), this.dom.board);
      renderRoster(this.state.getPlayerPieces(), this.dom.rosterGrid, (row, col) => this.showSellConfirmation(row, col));
      renderStatus(this.state, this.dom);
      this.showShop();
    }, 500);
  }

  handleMove(fromRow, fromCol, toRow, toCol) {
    this.board.movePiece(fromRow, fromCol, toRow, toCol);
    this.state.clearSelectedPiece();
    renderBoard(this.board.getState(), this.dom.board);
    if (this.dom.board) {
      animateShake(this.dom.board);
    }
    if (!this.checkWin()) {
      this.state.setPlayerTurn(false);
      renderStatus(this.state, this.dom);
      setTimeout(() => this.ai.makeMove(this), 500);
    }
  }

  selectPiece(row, col) {
    this.state.selectPiece(row, col);
    const piece = this.board.getPiece(row, col);
    const moves = this.rules.getPossibleMoves(piece, row, col, this.board);
    renderBoard(this.board.getState(), this.dom.board, { highlight: moves });
    document
      .querySelectorAll('.square')
      .forEach(s => s.classList.toggle('selected', parseInt(s.dataset.row) === row && parseInt(s.dataset.col) === col));
  }

  clearSelection() {
    this.state.clearSelectedPiece();
    renderBoard(this.board.getState(), this.dom.board);
  }

  showShop() {
    if (this.dom.board) {
      animateDropOut(this.dom.board);
    }
    setTimeout(() => {
      const packs = this.shop.generatePacks();
      renderShop(packs, this.dom.shop, packId => this.buyPack(packId));
      renderRoster(this.state.getPlayerPieces(), this.dom.rosterGrid, (row, col) => this.showSellConfirmation(row, col));
      if (this.dom.shop) {
        animateSlideIn(this.dom.shop);
      }
      if (this.dom.roster) {
        animateSlideIn(this.dom.roster);
      }
      if (this.dom.status) {
        this.dom.status.textContent = 'Shop Phase';
      }
    }, 500);
  }

  buyPack(packId) {
    const result = this.shop.buyPack(packId);
    if (!result.success) {
      alert(result.message);
      return;
    }
    renderStatus(this.state, this.dom);
    if (this.dom.shop) {
      animateSlideOut(this.dom.shop);
    }
    setTimeout(() => {
      renderPackSelection(result.pieces, this.dom.packSelection, piece => this.selectPackPiece(piece));
      if (this.dom.packSelection) {
        animateSlideIn(this.dom.packSelection);
      }
    }, 500);
  }

  selectPackPiece(type) {
    this.roster.addPiece(type, 'player');
    const result = this.shop.selectPiece(type);
    renderRoster(this.state.getPlayerPieces(), this.dom.rosterGrid, (row, col) => this.showSellConfirmation(row, col));
    if (this.dom.roster) {
      animateShake(this.dom.roster);
    }
    if (result.selectionsRemaining > 0) {
      const availablePieces = this.state.getPacks()[this.state.getCurrentPackType()].pieces;
      renderPackSelection(availablePieces, this.dom.packSelection, piece => this.selectPackPiece(piece));
    } else {
      this.returnToShop();
    }
  }

  returnToShop() {
    if (this.dom.packSelection) {
      animateSlideOut(this.dom.packSelection);
    }
    setTimeout(() => {
      this.shop.skipPackSelection();
      renderShop(this.state.getShopPacks(), this.dom.shop, packId => this.buyPack(packId));
      if (this.dom.shop) {
        animateSlideIn(this.dom.shop);
      }
    }, 500);
  }

  showSellConfirmation(row, col) {
    const piece = this.state.getPlayerPieces().find(p => p.row === row && p.col === col);
    if (!piece || piece.type === 'king') {
      alert(piece ? 'You cannot sell your king!' : 'No piece to sell!');
      return;
    }
    const sellValue = Math.floor(this.state.getPieceValues()[piece.type] / 2);
    this.pendingSell = { row, col, sellValue };
    if (this.dom.sellConfirmationText) {
      this.dom.sellConfirmationText.textContent = `Are you sure you want to sell your ${piece.type.charAt(0).toUpperCase() + piece.type.slice(1)} for ${sellValue} Gold?`;
    }
    if (this.dom.sellConfirmationDiv) {
      this.dom.sellConfirmationDiv.style.display = 'flex';
    }
  }

  confirmSell() {
    if (!this.pendingSell) return;
    const { row, col } = this.pendingSell;
    const result = this.roster.sellPiece(row, col, 'player');
    if (result.success) {
      renderRoster(this.state.getPlayerPieces(), this.dom.rosterGrid, (r, c) => this.showSellConfirmation(r, c));
      renderStatus(this.state, this.dom);
      if (this.dom.roster) {
        animateShake(this.dom.roster);
      }
    }
    this.cancelSell();
  }

  cancelSell() {
    if (this.dom.sellConfirmationDiv) {
      this.dom.sellConfirmationDiv.style.display = 'none';
    }
    this.pendingSell = null;
  }

  handleRosterDrop(fromRow, fromCol, toRow, toCol) {
    if (this.roster.rearrangePieces('player', fromRow, fromCol, toRow, toCol)) {
      renderRoster(this.state.getPlayerPieces(), this.dom.rosterGrid, (row, col) => this.showSellConfirmation(row, col));
      if (this.dom.roster) {
        animateShake(this.dom.roster);
      }
    }
  }

  continueGame() {
    if (this.dom.shop) {
      animateSlideOut(this.dom.shop);
    }
    if (this.dom.roster) {
      animateSlideOut(this.dom.roster);
    }
    setTimeout(() => {
      if (!this.state.isFirstRound()) {
        this.state.setBoardSize(this.state.getBoardSize() + 1);
        this.board.initialize(this.state.getBoardSize());
      }
      this.state.setFirstRound(false);
      this.state.incrementRound();
      this.state.setPlayerTurn(true);
      this.ai.rearrangePieces();
      const aiPieces = this.ai.buyPack();
      aiPieces.forEach(piece => this.roster.addPiece(piece, 'ai'));
      this.placePiecesOnBoard();
      renderBoard(this.board.getState(), this.dom.board);
      renderStatus(this.state, this.dom);
      if (this.dom.board) {
        animateDropIn(this.dom.board);
      }
      if (this.dom.gameContainer) {
        this.dom.gameContainer.style.display = 'flex';
      }
      if (this.checkWin()) return;
    }, 500);
  }

  skipPackSelection() {
    if (this.dom.packSelection) {
      animateSlideOut(this.dom.packSelection);
    }
    setTimeout(() => {
      this.shop.skipPackSelection();
      this.continueGame();
    }, 500);
  }

  placePiecesOnBoard() {
    const boardSize = this.state.getBoardSize();
    const playerPieces = this.state.getPlayerPieces();
    const aiPieces = this.state.getAIPieces();
    this.board.initialize(boardSize);

    playerPieces.forEach(piece => {
      const boardRow = piece.row === 1 ? boardSize - 1 : boardSize - 2;
      if (piece.col < boardSize) {
        this.board.setPiece(boardRow, piece.col, { type: piece.type, player: 'player', hasMoved: false });
      }
    });

    aiPieces.forEach(piece => {
      const boardRow = piece.row;
      if (piece.col < boardSize) {
        this.board.setPiece(boardRow, piece.col, { type: piece.type, player: 'ai', hasMoved: false });
      }
    });
  }

  checkWin() {
    const board = this.board.getState();
    let playerKing = false;
    let aiKing = false;

    for (let i = 0; i < this.state.getBoardSize(); i++) {
      for (let j = 0; j < this.state.getBoardSize(); j++) {
        if (board[i][j]) {
          if (board[i][j].type === 'king' && board[i][j].player === 'player') playerKing = true;
          if (board[i][j].type === 'king' && board[i][j].player === 'ai') aiKing = true;
        }
      }
    }

    if (!playerKing) {
      if (this.dom.status) {
        this.dom.status.textContent = 'AI Wins!';
      }
      if (this.dom.restartButton) {
        this.dom.restartButton.style.display = 'block';
      }
      return true;
    }
    if (!aiKing) {
      if (this.dom.status) {
        this.dom.status.textContent = 'Player Wins!';
      }
      if (this.dom.restartButton) {
        this.dom.restartButton.style.display = 'block';
      }
      return true;
    }
    return false;
  }

  restart() {
    if (this.dom.board) {
      animateDropOut(this.dom.board);
    }
    setTimeout(() => {
      if (this.dom.gameContainer) {
        this.dom.gameContainer.style.display = 'none';
      }
      if (this.dom.introScreen) {
        this.dom.introScreen.style.display = 'flex';
      }
      if (this.dom.restartButton) {
        this.dom.restartButton.style.display = 'none';
      }
      this.state.reset();
      this.board.initialize(this.state.getBoardSize());
      renderStatus(this.state, this.dom);
    }, 500);
  }
}