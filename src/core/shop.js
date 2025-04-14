// src/core/shop.js
import GameState from './gameState.js';
import Config from './config.js';

export class Shop {
  constructor() {
    if (!Config || !Config.shop || !Config.shop.packs) {
      console.error('Config.shop.packs is not defined. Using default packs.');
      GameState.setPacks({
        basic: { price: 3, pieces: ['pawn', 'pawn', 'knight'] },
        advanced: { price: 5, pieces: ['bishop', 'rook', 'knight'] },
        expert: { price: 8, pieces: ['queen', 'rook', 'bishop'] },
      });
    } else {
      GameState.setPacks({
        basic: Config.shop.packs.basic,
        advanced: Config.shop.packs.advanced,
        expert: Config.shop.packs.expert,
      });
    }
  }

  generatePacks() {
    const packs = GameState.getPacks();
    let result;
    if (!packs || !packs.basic || !packs.advanced || !packs.expert) {
      console.warn('Packs not properly initialized. Using default packs.');
      result = {
        pack1: { price: 3, pieces: ['pawn', 'pawn', 'knight'] },
        pack2: { price: 5, pieces: ['bishop', 'rook', 'knight'] },
        pack3: { price: 8, pieces: ['queen', 'rook', 'bishop'] },
      };
    } else {
      result = {
        pack1: packs.basic,
        pack2: packs.advanced,
        pack3: packs.expert,
      };
    }
    console.log('Generated packs:', result);
    GameState.setShopPacks(result);
    console.log('Shop packs after setting:', GameState.getShopPacks());
    return result;
  }

  buyPack(packId) {
    const packs = GameState.getShopPacks();
    if (!packs) {
      console.error('Shop packs not initialized. Cannot buy pack.');
      return { success: false, message: 'Shop not initialized!' };
    }
    const pack = packs[packId];
    if (!pack) return { success: false, message: 'Invalid pack!' };
    const gold = GameState.getGold();
    if (gold < pack.price) {
      return { success: false, message: 'Not enough gold!' };
    }
    GameState.setGold(gold - pack.price);
    GameState.setCurrentPackType(packId);
    return { success: true, pieces: pack.pieces };
  }

  selectPiece(type) {
    const packType = GameState.getCurrentPackType();
    const packs = GameState.getPacks();
    const pack = packs[packType];
    const remainingPieces = pack.pieces.filter(p => p !== type);
    GameState.setPacks({
      ...packs,
      [packType]: { ...pack, pieces: remainingPieces },
    });
    return { selectionsRemaining: remainingPieces.length };
  }

  skipPackSelection() {
    GameState.setCurrentPackType(null);
  }
}