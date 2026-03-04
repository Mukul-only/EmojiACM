"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGameHistory = exports.getGameStats = void 0;
const gameHistory_model_1 = require("../models/gameHistory.model");
const getGameStats = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Get all games where user participated
        const games = await gameHistory_model_1.GameHistory.find({
            "players.id": userId,
        }).sort({ completedAt: -1 });
        const gamesPlayed = games.length;
        const totalScore = games.reduce((sum, game) => sum + game.finalScore, 0);
        const averageScore = gamesPlayed > 0 ? Math.round(totalScore / gamesPlayed) : 0;
        const bestScore = gamesPlayed > 0 ? Math.max(...games.map((g) => g.finalScore)) : 0;
        // Calculate win rate (assuming score > 0 means win)
        const wins = games.filter((game) => game.finalScore > 0).length;
        const winRate = gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0;
        const totalRoundsPlayed = games.reduce((sum, game) => sum + game.roundsPlayed, 0);
        const averageRoundsPerGame = gamesPlayed > 0 ? Math.round(totalRoundsPlayed / gamesPlayed) : 0;
        const totalPlayTime = games.reduce((sum, game) => sum + game.duration, 0);
        const averagePlayTime = gamesPlayed > 0 ? Math.round(totalPlayTime / gamesPlayed) : 0;
        // Get recent games (last 10)
        const recentGames = games.slice(0, 10).map((game) => {
            const userInGame = game.players.find((p) => p.id.toString() === userId);
            return {
                gameId: game.gameId,
                finalScore: game.finalScore,
                roundsPlayed: game.roundsPlayed,
                duration: game.duration,
                completedAt: game.completedAt.toISOString(),
                role: userInGame?.role || "guesser",
            };
        });
        const stats = {
            gamesPlayed,
            totalScore,
            averageScore,
            winRate,
            bestScore,
            totalRoundsPlayed,
            averageRoundsPerGame,
            totalPlayTime,
            averagePlayTime,
            recentGames,
        };
        res.json(stats);
    }
    catch (error) {
        console.error("Error fetching game stats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getGameStats = getGameStats;
const getGameHistory = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const games = await gameHistory_model_1.GameHistory.find({
            "players.id": userId,
        })
            .sort({ completedAt: -1 })
            .skip(skip)
            .limit(limit);
        const totalGames = await gameHistory_model_1.GameHistory.countDocuments({
            "players.id": userId,
        });
        const gamesWithUserRole = games.map((game) => {
            const userInGame = game.players.find((p) => p.id.toString() === userId);
            return {
                ...game.toObject(),
                userRole: userInGame?.role || "guesser",
            };
        });
        res.json({
            games: gamesWithUserRole,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalGames / limit),
                totalGames,
                hasNext: page < Math.ceil(totalGames / limit),
                hasPrev: page > 1,
            },
        });
    }
    catch (error) {
        console.error("Error fetching game history:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getGameHistory = getGameHistory;
