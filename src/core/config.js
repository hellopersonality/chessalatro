// src/core/config.js
export const config = {
  pieceValues: { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 3 },
  pieceTypes: ['pawn', 'knight', 'bishop', 'rook', 'queen'],
  packs: {
    basic: { cost: 5, pieces: ['pawn', 'knight', 'bishop'], img: './packs/BasicPack.png', double: false },
    middle: { cost: 10, pieces: ['pawn', 'knight', 'bishop', 'rook'], img: './packs/MiddlePack.png', double: false },
    ultra: { cost: 15, pieces: ['knight', 'bishop', 'rook', 'queen'], img: './packs/UltraPack.png', double: false },
    double_basic: { cost: 5, pieces: ['pawn', 'knight', 'bishop'], img: './packs/2BasicPack.png', double: true },
    double_middle: { cost: 10, pieces: ['pawn', 'knight', 'bishop', 'rook'], img: './packs/2MiddlePack.png', double: true },
    double_ultra: { cost: 15, pieces: ['knight', 'bishop', 'rook', 'queen'], img: './packs/2UltraPack.png', double: true },
  },
  initialBoardSize: 4,
};