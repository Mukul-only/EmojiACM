import axios from "axios";

// Create an Axios instance for game-related API calls
const apiClient = axios.create({
  baseURL: "/api/game", // The base URL for all game-related requests
  withCredentials: true, // Important for sending cookies with requests
});

// If there's a token in localStorage, add it to the headers
const token = localStorage.getItem("authToken");
if (token) {
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export interface GameStats {
  gamesPlayed: number;
  totalScore: number;
  averageScore: number;
  winRate: number;
  bestScore: number;
  totalRoundsPlayed: number;
  averageRoundsPerGame: number;
  totalPlayTime: number; // in seconds
  averagePlayTime: number; // in seconds
  recentGames: {
    gameId: string;
    finalScore: number;
    roundsPlayed: number;
    duration: number;
    completedAt: string;
    role: "clue-giver" | "guesser";
  }[];
}

export const getGameStats = async (): Promise<GameStats> => {
  try {
    const response = await apiClient.get("/stats");
    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to fetch game stats:",
      error.response?.data?.message || error.message
    );
    // Rethrow with more context
    throw error.response?.data?.message
      ? new Error(error.response.data.message)
      : error;
  }
};

export const getGameHistory = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await apiClient.get(
      `/game/history?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to fetch game history:",
      error.response?.data?.message || error.message
    );
    throw error.response?.data?.message
      ? new Error(error.response.data.message)
      : error;
  }
};

export const checkEligibility = async () => {
  try {
    const response = await apiClient.get("/eligibility");
    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to check eligibility:",
      error.response?.data?.message || error.message
    );
    throw error.response?.data?.message
      ? new Error(error.response.data.message)
      : error;
  }
};
