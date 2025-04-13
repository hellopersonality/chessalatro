// src/ui/interactions.js
import GameState from '../core/gameState.js';
import { Rules } from '../core/rules.js';
import { renderBoard } from './renderer.js';
import { renderStatus } from './statusRenderer.js';

export function initInteractions(game, dom) {
  const rules = new Rules();
  const board = game.board;

  const handleSquareClick = e => {
    if (!GameState.isPlayerTurn()) return;
    const square = e.target.closest('.square');
    if (!square) return;
    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);

    const selectedPiece = GameState.getSelectedPiece();
    if (selectedPiece) {
      const { row: fromRow, col: fromCol } = selectedPiece;
      const piece = board.getPiece(fromRow, fromCol);
      if (rules.isValidMove(piece, fromRow, fromCol, row, col, board)) {
        game.handleMove(fromRow, fromCol, row, col);
      } else {
        game.clearSelection();
        if (board.getPiece(row, col)?.player === 'player' && (selectedPiece.row !== row || selectedPiece.col !== col)) {
          game.selectPiece(row, col);
        }
      }
    } else if (board.getPiece(row, col)?.player === 'player') {
      game.selectPiece(row, col);
    }
  };

  dom.board.addEventListener('click', handleSquareClick);

  let draggedPiece = null;
  dom.rosterGrid.addEventListener('dragstart', e => {
    if (!e.target.classList.contains('roster-piece-image')) return;
    draggedPiece = {
      row: parseInt(e.target.dataset.row),
      col: parseInt(e.target.dataset.col),
      type: e.target.alt,
    };
    e.dataTransfer.setData('text/plain', '');
    e.target.style.opacity = '0.5';
  });

  dom.rosterGrid.addEventListener('dragover', e => e.preventDefault());

  dom.rosterGrid.addEventListener('dragenter', e => {
    const slot = e.target.closest('.roster-slot');
    if (slot) slot.classList.add('drag-over');
  });

  dom.rosterGrid.addEventListener('dragleave', e => {
    const slot = e.target.closest('.roster-slot');
    if (slot) slot.classList.remove('drag-over');
  });

  dom.rosterGrid.addEventListener('drop', e => {
    e.preventDefault();
    const slot = e.target.closest('.roster-slot');
    if (!slot) return;
    slot.classList.remove('drag-over');
    const targetRow = parseInt(slot.dataset.row);
    const targetCol = parseInt(slot.dataset.col);
    const nextBoardSize = GameState.getBoardSize() + (GameState.isFirstRound() ? 0 : 1);

    if (targetCol >= nextBoardSize) {
      const draggedImg = dom.rosterGrid.querySelector(
        `.roster-piece-image[data-row="${draggedPiece.row}"][data-col="${draggedPiece.row}"]`
      );
      if (draggedImg) draggedImg.style.opacity = '1';
      return;
    }

    game.handleRosterDrop(draggedPiece.row, draggedPiece.col, targetRow, targetCol);
    const draggedImg = dom.rosterGrid.querySelector(
      `.roster-piece-image[data-row="${draggedPiece.row}"][data-col="${draggedPiece.col}"]`
    );
    if (draggedImg) draggedImg.style.opacity = '1';
  });

  dom.confirmSellButton.addEventListener('click', () => game.confirmSell());
  dom.cancelSellButton.addEventListener('click', () => game.cancelSell());
  dom.buyPack1Button.addEventListener('click', () => game.buyPack('pack1'));
  dom.buyPack2Button.addEventListener('click', () => game.buyPack('pack2'));
  dom.buyPack3Button.addEventListener('click', () => game.buyPack('pack3'));
  dom.continueButton.addEventListener('click', () => game.continueGame());
  dom.skipPackButton.addEventListener('click', () => game.skipPackSelection());
  dom.restartButton.addEventListener('click', () => game.restart());
  dom.startNormal.addEventListener('click', () => game.start(false));
  dom.startPermadeath.addEventListener('click', () => game.start(true));
}