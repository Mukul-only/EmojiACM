"use strict";
// For simplicity, we'll manage game state in-memory.
// For a production app, use Redis or another distributed store.
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameManager = void 0;
class GameManager {
    games = new Map();
}
exports.gameManager = new GameManager();
