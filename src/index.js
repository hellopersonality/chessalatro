// src/index.js
import { Game } from './game.js';
import { initInteractions } from './ui/interactions.js';

document.addEventListener('DOMContentLoaded', () => {
  const dom = {
    introScreen: document.getElementById('intro-screen'),
    gameContainer: document.getElementById('game-container'),
    board: document.getElementById('board'),
    rosterGrid: document.getElementById('roster-grid'),
    shop: document.getElementById('shop'),
    packSelection: document.getElementById('pack-selection'),
    sellConfirmationDiv: document.getElementById('sell-confirmation'),
    sellConfirmationText: document.getElementById('sell-confirmation-text'),
    confirmSellButton: document.getElementById('confirm-sell'),
    cancelSellButton: document.getElementById('cancel-sell'),
    buyPack1Button: document.getElementById('buy-pack1'),
    buyPack2Button: document.getElementById('buy-pack2'),
    buyPack3Button: document.getElementById('buy-pack3'),
    continueButton: document.getElementById('continue-button'),
    skipPackButton: document.getElementById('skip-pack-button'),
    restartButton: document.getElementById('restart-button'),
    startNormal: document.getElementById('start-normal'),
    startPermadeath: document.getElementById('start-permadeath'),
    status: document.getElementById('status'),
    currency: document.getElementById('currency'),
    aiCurrency: document.getElementById('ai-currency'),
    round: document.getElementById('round'),
  };

  // Debug log to check if DOM elements are found
  console.log('packSelection:', dom.packSelection);
  console.log('shop:', dom.shop);

  const game = new Game(dom);
  initInteractions(game, dom);
});