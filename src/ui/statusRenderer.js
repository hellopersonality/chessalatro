// src/ui/statusRenderer.js
import GameState from '../core/gameState.js';

export function renderStatus(state, dom) {
  dom.status.textContent = GameState.isPlayerTurn() ? "Player's Turn" : "AI's Turn";
  dom.currency.textContent = `Gold: ${GameState.getGold()}`;
  dom.aiCurrency.textContent = `AI Gold: ${GameState.getAIGold()}`;
  dom.round.textContent = `Round: ${GameState.getRound()}`;
}