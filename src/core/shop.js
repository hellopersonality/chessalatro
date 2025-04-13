// src/core/shop.js
import GameState from './gameState.js';

export class Shop {
  generatePacks() {
    const basePacks = ['basic', 'middle', 'ultra'];
    const shuffledPacks = [...basePacks].sort(() => Math.random() - 0.5);
    const shopPacks = {
      pack1: shuffledPacks[0],
      pack2: shuffledPacks[1],
      pack3: shuffledPacks[2],
    };
    const packKeys = ['pack1', 'pack2', 'pack3'];
    const randomPack = packKeys[Math.floor(Math.random() * packKeys.length)];
    shopPacks[randomPack] = `double_${shopPacks[randomPack]}`;
    GameState.setShopPacks(shopPacks);
    return shopPacks;
  }

  buyPack(packId) {
    const shopPacks = GameState.getShopPacks();
    const packType = shopPacks[packId];
    const pack = GameState.getPacks()[packType];

    if (GameState.getGold() < pack.cost) {
      return { success: false, message: 'Not enough gold!' };
    }

    if (GameState.getCurrentPackType()) {
      return { success: false, message: 'Another pack is being processed!' };
    }

    GameState.setGold(GameState.getGold() - pack.cost);
    GameState.setCurrentPackType(packType);
    GameState.setSelectionsRemaining(pack.double ? 2 : 1);

    const packPieces = [];
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * pack.pieces.length);
      packPieces.push(pack.pieces[randomIndex]);
    }

    return { success: true, pieces: packPieces };
  }

  selectPiece(type) {
    const selectionsRemaining = GameState.getSelectionsRemaining();
    GameState.setSelectionsRemaining(selectionsRemaining - 1);
    return { type, selectionsRemaining: selectionsRemaining - 1 };
  }

  skipPackSelection() {
    GameState.setCurrentPackType(null);
    GameState.setSelectionsRemaining(1);
  }
}