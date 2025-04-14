// src/utils/helpers.js
export function createPieceElement(piece) {
  const img = document.createElement('img');
  img.src = `/src/assets/pieces/${piece.player === 'player' ? 'white' : 'black'}/${piece.type.toLowerCase()}.png`;
  img.className = 'piece-image';
  img.alt = piece.type;
  return img;
}