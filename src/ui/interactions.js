// src/ui/interactions.js
export function initInteractions(game, dom) {
  let draggedPiece = null;
  let draggedFromBoard = false;

  function findSquare(row, col, grid) {
    return grid.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  }

  if (!dom.startNormal || !dom.startPermadeath) {
    console.error('Start buttons not found in the DOM');
    return;
  }

  dom.startNormal.addEventListener('click', () => game.start(false));
  dom.startPermadeath.addEventListener('click', () => game.start(true));

  dom.board.addEventListener('click', e => {
    const square = e.target.closest('.square');
    if (!square) return;
    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);

    if (game.state.isPlayerTurn()) {
      if (game.state.getSelectedPiece()) {
        const { row: fromRow, col: fromCol } = game.state.getSelectedPiece();
        if (fromRow === row && fromCol === col) {
          game.clearSelection();
        } else {
          const moves = game.rules.getPossibleMoves(game.board.getPiece(fromRow, fromCol), fromRow, fromCol, game.board);
          if (moves.some(([r, c]) => r === row && c === col)) {
            game.handleMove(fromRow, fromCol, row, col);
          } else {
            game.clearSelection();
            game.selectPiece(row, col);
          }
        }
      } else {
        game.selectPiece(row, col);
      }
    }
  });

  dom.rosterGrid.addEventListener('dragstart', e => {
    const slot = e.target.closest('.roster-slot');
    if (!slot) return;
    draggedPiece = { row: parseInt(slot.dataset.row), col: parseInt(slot.dataset.col) };
    draggedFromBoard = false;
    e.dataTransfer.setData('text/plain', 'roster');
  });

  dom.rosterGrid.addEventListener('dragover', e => {
    e.preventDefault();
    const slot = e.target.closest('.roster-slot');
    if (slot) {
      slot.classList.add('drag-over');
    } else {
      console.warn('Dragover: No roster-slot found. Target:', e.target, 'Parent:', e.target.parentElement);
    }
  });

  dom.rosterGrid.addEventListener('dragleave', e => {
    const slot = e.target.closest('.roster-slot');
    if (slot) {
      slot.classList.remove('drag-over');
    } else {
      console.warn('Dragleave: No roster-slot found. Target:', e.target, 'Parent:', e.target.parentElement);
    }
  });

  dom.rosterGrid.addEventListener('drop', e => {
    e.preventDefault();
    const slot = e.target.closest('.roster-slot');
    if (!slot || !draggedPiece) return;
    const toRow = parseInt(slot.dataset.row);
    const toCol = parseInt(slot.dataset.col);
    slot.classList.remove('drag-over');
    if (!draggedFromBoard) {
      game.handleRosterDrop(draggedPiece.row, draggedPiece.col, toRow, toCol);
    }
    draggedPiece = null;
  });

  dom.confirmSellButton.addEventListener('click', () => game.confirmSell());
  dom.cancelSellButton.addEventListener('click', () => game.cancelSell());

  dom.buyPack1Button.addEventListener('click', () => game.buyPack('pack1'));
  dom.buyPack2Button.addEventListener('click', () => game.buyPack('pack2'));
  dom.buyPack3Button.addEventListener('click', () => game.buyPack('pack3'));

  console.log('Continue button:', dom.continueButton);
  if (dom.continueButton) {
    dom.continueButton.addEventListener('click', () => {
      console.log('Continue button clicked');
      if (typeof game.continueGame === 'function') {
        game.continueGame();
      } else {
        console.error('continueGame is not a function on game object:', game);
      }
    });
  } else {
    console.error('Continue button not found in the DOM');
  }

  dom.skipPackButton.addEventListener('click', () => game.skipPackSelection());

  dom.restartButton.addEventListener('click', () => game.restart());
}