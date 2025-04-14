// src/ui/renderer.js
import { createPieceElement } from '../utils/helpers.js'; // Updated path

export function renderBoard(board, grid, options = {}) {
  const { highlight = [] } = options;
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = `repeat(${board.length}, 64px)`;
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const square = document.createElement('div');
      square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
      square.dataset.row = row;
      square.dataset.col = col;

      if (highlight.some(([r, c]) => r === row && c === col)) {
        square.classList.add('highlight');
      }

      if (board[row][col]) {
        square.appendChild(createPieceElement(board[row][col]));
      }
      grid.appendChild(square);
    }
  }
}

export function renderRoster(pieces, grid, onSellClick) {
  grid.innerHTML = '';
  const boardSize = 2; // Hardcoded for roster
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < 5; col++) {
      const slot = document.createElement('div');
      slot.className = `roster-slot ${(row + col) % 2 === 0 ? 'roster-light' : 'roster-dark'}`;
      slot.dataset.row = row;
      slot.dataset.col = col;

      const piece = pieces.find(p => p.row === row && p.col === col);
      if (piece) {
        const pieceImage = document.createElement('img');
        // Ensure filenames match exactly (e.g., king.png, not King.png)
        pieceImage.src = `/src/assets/pieces/${piece.player === 'player' ? 'white' : 'black'}/${piece.type.toLowerCase()}.png`;
        pieceImage.className = 'roster-piece-image';
        pieceImage.draggable = true;
        pieceImage.alt = piece.type;

        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip';
        tooltip.textContent = piece.type.charAt(0).toUpperCase() + piece.type.slice(1);
        slot.appendChild(tooltip);

        slot.appendChild(pieceImage);

        const sellButton = document.createElement('button');
        sellButton.className = 'sell-button';
        sellButton.textContent = 'Sell';
        sellButton.addEventListener('click', () => onSellClick(row, col));
        slot.appendChild(sellButton);
      }
      grid.appendChild(slot);
    }
  }
}