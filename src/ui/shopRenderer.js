// src/ui/shopRenderer.js
import { createPieceElement } from '../utils/helpers.js';

export function renderShop(packs, shopDiv, onBuyClick) {
  shopDiv.style.display = 'flex';
  const pack1Text = document.getElementById('pack1-text');
  const pack2Text = document.getElementById('pack2-text');
  const pack3Text = document.getElementById('pack3-text');
  const pack1Img = document.getElementById('pack1-img');
  const pack2Img = document.getElementById('pack2-img');
  const pack3Img = document.getElementById('pack3-img');

  pack1Img.src = '/src/assets/packs/pack1.png';
  pack2Img.src = '/src/assets/packs/pack2.png';
  pack3Img.src = '/src/assets/packs/pack3.png';

  pack1Text.textContent = `Basic Pack - ${packs.pack1.price} Gold (${packs.pack1.pieces.join(', ')})`;
  pack2Text.textContent = `Advanced Pack - ${packs.pack2.price} Gold (${packs.pack2.pieces.join(', ')})`;
  pack3Text.textContent = `Expert Pack - ${packs.pack3.price} Gold (${packs.pack3.pieces.join(', ')})`;
}

export function renderPackSelection(pieces, packSelectionDiv, onSelectPiece) {
  packSelectionDiv.style.display = 'flex';
  const container = packSelectionDiv.querySelector('.pack-items-container');
  container.innerHTML = '';
  pieces.forEach(piece => {
    const item = document.createElement('div');
    item.className = 'pack-item';
    const pieceElement = createPieceElement({ type: piece, player: 'player' });
    item.appendChild(pieceElement);
    const name = document.createElement('span');
    name.textContent = piece.charAt(0).toUpperCase() + piece.slice(1);
    item.appendChild(name);
    item.addEventListener('click', () => onSelectPiece(piece));
    container.appendChild(item);
  });
}