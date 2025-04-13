// src/ui/shopRenderer.js
import GameState from '../core/gameState.js';

export function renderShop(packs, container, buyCallback) {
  container.style.display = 'flex';
  container.classList.remove('slide-in', 'slide-out');
  requestAnimationFrame(() => {
    container.classList.add('slide-in');
  });

  const packKeys = ['pack1', 'pack2', 'pack3'];
  packKeys.forEach(packId => {
    const packType = packs[packId];
    const packData = GameState.getPacks()[packType];
    const img = document.getElementById(`${packId}-img`);
    const text = document.getElementById(`${packId}-text`);
    const button = document.getElementById(`buy-${packId}`);

    img.src = packData.img;
    img.alt = packType.replace('double_', '') + (packData.double ? ' Double Pack' : ' Pack');
    text.textContent = `${packType.replace('double_', '').charAt(0).toUpperCase() + packType.replace('double_', '').slice(1)}${packData.double ? ' Double' : ''} Pack - ${packData.cost} Gold`;
    button.disabled = false;
    button.onclick = () => buyCallback(packId);
  });
}

export function renderPackSelection(pieces, container, selectCallback) {
  container.style.display = 'flex';
  container.classList.remove('slide-in', 'slide-out');
  requestAnimationFrame(() => {
    container.classList.add('slide-in');
  });

  const title = document.getElementById('pack-selection-title');
  const packContainer = container.querySelector('.pack-items-container');
  const selectionsRemaining = GameState.getSelectionsRemaining();
  title.textContent = GameState.getPacks()[GameState.getCurrentPackType()]?.double
    ? `Select Pieces (${selectionsRemaining} remaining)`
    : 'Select a Piece';

  packContainer.innerHTML = '';
  pieces.forEach(piece => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'pack-item';
    itemDiv.innerHTML = `
      <img src="./pieces/white/${piece}.png" alt="${piece}">
      <span>${piece.charAt(0).toUpperCase() + piece.slice(1)}</span>
      <button class="select-piece-button" data-piece="${piece}">Select</button>
    `;
    packContainer.appendChild(itemDiv);
  });

  packContainer.querySelectorAll('.select-piece-button').forEach(button => {
    const piece = button.dataset.piece;
    button.onclick = () => selectCallback(piece);
  });
}