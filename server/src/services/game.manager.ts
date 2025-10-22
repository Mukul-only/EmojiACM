// For simplicity, we'll manage game state in-memory.
// For a production app, use Redis or another distributed store.

interface Player {
  id: string;
  username: string;
  score: number;
}

interface GameState {
  roomId: string;
  players: Map<string, Player>;
  currentMovie: string;
  currentEmojis: string;
  timer: number;
  timerId: NodeJS.Timeout | null;
  isRoundActive: boolean;
}

class GameManager {
  private games: Map<string, GameState> = new Map();
}

export const gameManager = new GameManager();
