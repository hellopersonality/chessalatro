// src/core/config.js
export default {
  shop: {
    packs: {
      basic: {
        price: 3,
        pieces: ['pawn', 'pawn', 'knight']
      },
      advanced: {
        price: 5,
        pieces: ['bishop', 'rook', 'knight']
      },
      expert: {
        price: 8,
        pieces: ['queen', 'rook', 'bishop']
      }
    }
  },
  ai: {
    strategies: {
      basic: 'single_middlegame',
      advanced: 'double_middlegame',
      expert: 'endgame'
    }
  }
};