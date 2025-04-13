// src/ui/renderer.js
import GameState from '../core/gameState.js';

export function renderBoard(board, container, options = {}) {
  const { animate = false, highlight = [] } = options;
  const boardSize = GameState.getBoardSize();
  container.style.gridTemplateColumns = `repeat(${boardSize}, 64px)`;
  container.innerHTML = '';

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      const square = document.createElement('div');
      square.className = `square ${(i + j) % 2 === 0 ? 'light' : 'dark'}`;
      square.dataset.row = i;
      square.dataset.col = j;

      if (highlight.some(([r, c]) => r === i && c === j)) {
        square.classList.add('highlight');
      }

      const piece = board[i][j];
      if (piece) {
        const img = document.createElement('img');
        img.className = 'piece-image';
        img.src = piece.player === 'player' ? `./pieces/white/${piece.type}.png` : `./pieces/black/${piece.type}.png`;
        img.alt = `${piece.type} (${piece.player})`;
        square.appendChild(img);
      }

      container.appendChild(square);
    }
  }

  if (animate) {
    container.classList.add('drop-in');
    setTimeout(() => container.classList.remove('drop-in'), 500);
  }
}

export function renderRoster(pieces, container, sellCallback) {
  const boardSize = GameState.getBoardSize();
  const nextBoardSize = boardSize + (GameState.isFirstRound() ? 0 : 1);
  container.style.gridTemplateColumns = `repeat(${nextBoardSize}, 64px)`;
  container.style.width = `${nextBoardSize * 64 + (nextBoardSize - 1) * 2}px`;
  container.innerHTML = '';

  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < nextBoardSize; col++) {
      const slot = document.createElement('div');
      slot.className = 'roster-slot';
      slot.dataset.row = row;
      slot.dataset.col = col;
      const boardRow = row === 1 ? boardSize - 1 : boardSize - 2;
      slot.classList.add((boardRow + col) % 2 === 0 ? 'roster-light' : 'roster-dark');

      const piece = pieces.find(p => p.row === row && p.col === col);
      if (piece) {
        const img = document.createElement('img');
        img.className = 'roster-piece-image';
        img.src = `./pieces/white/${piece.type}.png`;
        img.alt = piece.type;
        img.draggable = true;
        img.dataset.row = row;
        img.dataset.col = col;
        slot.appendChild(img);
        slot.dataset.type = piece.type;

        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip';
        const pieceValues = GameState.getPieceValues();
        tooltip.textContent =
          piece.type === 'king'
            ? `${piece.type.charAt(0).toUpperCase() + piece.type.slice(1)}`
            : `${piece.type.charAt(0).toUpperCase() + piece.type.slice(1)} (Sell for ${Math.floor(pieceValues[piece.type] / 2)} Gold)`;
        slot.appendChild(tooltip);

        if (piece.type !== 'king') {
          const sellButton = document.createElement('button');
          sellButton.className = 'sell-button';
          sellButton.textContent = 'Sell';
          sellButton.onclick = () => sellCallback(row, col);
          slot.appendChild(sellButton);
        }
      }

      if (col >= boardSize && !GameState.isFirstRound()) {
        slot.classList.add('newly-available');
      }

      container.appendChild(slot);
    }
  }
}