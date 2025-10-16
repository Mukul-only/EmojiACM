"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGameHandlers = void 0;
const registration_model_1 = require("../models/registration.model");
const leaderboard_model_1 = require("../models/leaderboard.model");
const gameHistory_model_1 = require("../models/gameHistory.model");
const validate_1 = require("../utils/validate");
const movies_1 = require("../data/movies");
const gameRooms = new Map();
const lobbyRooms = new Map();
const TOTAL_ROUNDS = 2;
function initializeGameState(roomId, players) {
    gameRooms.set(roomId, {
        players: new Map(players.map((p) => [p.id, { username: p.username }])),
        teamScore: 0,
        currentMovie: "",
        currentMovieData: null,
        currentEmojis: "",
        guesserId: null,
        clueGiverId: null,
        timer: 60,
        isRoundActive: false,
        timerId: null,
        currentRound: 0,
        totalRounds: TOTAL_ROUNDS,
        gameStartTime: Date.now(),
        gameId: `game_${roomId}_${Date.now()}`,
    });
}
const registerGameHandlers = (io) => {
    const gameNamespace = io.of("/game");
    gameNamespace.on("connection", async (socket) => {
        // This initial check is still important.
        if (!socket.user) {
            socket.emit("error", { message: "Authentication failed." });
            socket.disconnect(true);
            return;
        }
        try {
            const registration = await registration_model_1.Registration.findOne({
                type: "group",
                members: { $size: 2, $all: [socket.user.id] },
            });
            if (!registration) {
                socket.emit("error", { message: "Not eligible for any game." });
                socket.disconnect(true);
                return;
            }
            const roomId = registration.id;
            socket.join(roomId);
            const connectedClients = gameNamespace.adapter.rooms.get(roomId);
            if (connectedClients?.size === 1 && gameRooms.has(roomId)) {
                clearInterval(gameRooms.get(roomId).timerId);
                gameRooms.delete(roomId);
            }
            if (!gameRooms.has(roomId)) {
                const memberDocs = await registration_model_1.Registration.findById(roomId).populate("members", "username");
                const players = memberDocs?.members.map((m) => ({
                    id: m.id,
                    username: m.username,
                })) || [];
                initializeGameState(roomId, players);
            }
            gameNamespace
                .to(roomId)
                .emit("player_joined", { username: socket.user.username });
            gameNamespace.to(roomId).emit("score_update", {
                teamScore: gameRooms.get(roomId)?.teamScore || 0,
            });
            socket.on("start_round", async () => {
                const room = gameRooms.get(roomId);
                const currentClients = gameNamespace.adapter.rooms.get(roomId);
                if (room && !room.isRoundActive && currentClients?.size === 2) {
                    if (room.currentRound >= room.totalRounds) {
                        try {
                            const finalRegistration = await registration_model_1.Registration.findById(roomId);
                            if (finalRegistration) {
                                await leaderboard_model_1.Leaderboard.findOneAndUpdate({ registrationId: roomId }, {
                                    teamName: finalRegistration.groupName,
                                    members: finalRegistration.members,
                                    score: room.teamScore,
                                }, { upsert: true, new: true, setDefaultsOnInsert: true });
                                console.log(`[Leaderboard] Saved final score for team ${finalRegistration.groupName}: ${room.teamScore}`);
                            }
                            // Store game history
                            const gameDuration = Math.floor((Date.now() - room.gameStartTime) / 1000);
                            const players = [];
                            room.players.forEach((player, id) => {
                                players.push({
                                    id: id,
                                    username: player.username,
                                    role: id === room.clueGiverId ? "clue-giver" : "guesser",
                                });
                            });
                            await gameHistory_model_1.GameHistory.create({
                                gameId: room.gameId,
                                players: players,
                                finalScore: room.teamScore,
                                roundsPlayed: room.currentRound,
                                totalRounds: room.totalRounds,
                                duration: gameDuration,
                            });
                            console.log(`[GameHistory] Saved game history for game ${room.gameId}`);
                        }
                        catch (dbError) {
                            console.error("[GameHistory] Failed to save game history:", dbError);
                        }
                        gameNamespace
                            .to(roomId)
                            .emit("game_over", { teamScore: room.teamScore });
                        return;
                    }
                    room.currentRound++;
                    room.isRoundActive = true;
                    const selectedMovie = (0, movies_1.getRandomMovie)();
                    room.currentMovie = selectedMovie.title;
                    room.currentMovieData = selectedMovie;
                    room.currentEmojis = "";
                    room.timer = 60;
                    const playerIds = Array.from(room.players.keys());
                    // Ensure proper role assignment - first player is clue-giver, second is guesser
                    room.clueGiverId = playerIds[0];
                    room.guesserId = playerIds[1];
                    gameNamespace.to(roomId).emit("round_start", {
                        clueGiverId: room.clueGiverId,
                        guesserId: room.guesserId,
                        movieTitle: room.currentMovie,
                        movieData: room.currentMovieData,
                        movieToGuess: "🎬".repeat(room.currentMovie.replace(/ /g, "").length),
                        currentRound: room.currentRound,
                        totalRounds: room.totalRounds,
                    });
                    room.timerId = setInterval(() => {
                        room.timer--;
                        gameNamespace
                            .to(roomId)
                            .emit("timer_tick", { timeLeft: room.timer });
                        if (room.timer <= 0) {
                            clearInterval(room.timerId);
                            room.isRoundActive = false;
                            gameNamespace.to(roomId).emit("round_end", {
                                correct: false,
                                message: `Time's up! The movie was: ${room.currentMovie}`,
                                teamScore: room.teamScore,
                            });
                        }
                    }, 1000);
                }
                else {
                    socket.emit("error", {
                        message: "Waiting for the other player to join...",
                    });
                }
            });
            socket.on("send_emoji", ({ emoji }) => {
                if (!socket.user)
                    return; // TYPE GUARD
                const room = gameRooms.get(roomId);
                if (socket.user.id !== room.clueGiverId) {
                    return socket.emit("error", {
                        message: "Only the Clue-Giver can send emojis!",
                    });
                }
                if (room && room.isRoundActive && (0, validate_1.isOnlyEmojis)(emoji)) {
                    room.currentEmojis += emoji;
                    gameNamespace
                        .to(roomId)
                        .emit("emoji_update", { emojis: room.currentEmojis });
                }
            });
            socket.on("delete_last_emoji", () => {
                if (!socket.user)
                    return; // TYPE GUARD
                const room = gameRooms.get(roomId);
                if (socket.user.id !== room.clueGiverId) {
                    return socket.emit("error", {
                        message: "Only the Clue-Giver can edit clues!",
                    });
                }
                if (room && room.isRoundActive && room.currentEmojis.length > 0) {
                    const emojiArray = Array.from(room.currentEmojis);
                    emojiArray.pop();
                    room.currentEmojis = emojiArray.join("");
                    gameNamespace
                        .to(roomId)
                        .emit("emoji_update", { emojis: room.currentEmojis });
                }
            });
            socket.on("clear_all_emojis", () => {
                if (!socket.user)
                    return; // TYPE GUARD
                const room = gameRooms.get(roomId);
                if (socket.user.id !== room.clueGiverId) {
                    return socket.emit("error", {
                        message: "Only the Clue-Giver can edit clues!",
                    });
                }
                if (room && room.isRoundActive) {
                    room.currentEmojis = "";
                    gameNamespace
                        .to(roomId)
                        .emit("emoji_update", { emojis: room.currentEmojis });
                }
            });
            socket.on("submit_guess", ({ guess }) => {
                if (!socket.user)
                    return; // TYPE GUARD
                const room = gameRooms.get(roomId);
                if (socket.user.id !== room.guesserId) {
                    return socket.emit("error", {
                        message: "Only the Guesser can submit a guess!",
                    });
                }
                if (room && room.isRoundActive) {
                    if (guess.toLowerCase().trim() ===
                        room.currentMovie.toLowerCase().trim()) {
                        clearInterval(room.timerId);
                        room.teamScore += room.timer;
                        room.isRoundActive = false;
                        gameNamespace.to(roomId).emit("round_end", {
                            correct: true,
                            message: `${socket.user.username} guessed it! The movie was: ${room.currentMovie}`,
                            teamScore: room.teamScore,
                        });
                    }
                    else {
                        socket.emit("guess_result", { correct: false });
                        gameNamespace.to(roomId).emit("new_incorrect_guess", {
                            guesserName: socket.user.username,
                            guess: guess,
                        });
                    }
                }
            });
            // Lobby handlers
            socket.on("join_lobby", () => {
                const roomId = socket.user?.id || "default";
                const lobbyRoom = lobbyRooms.get(roomId) || {
                    players: [],
                    roomId: roomId,
                };
                // Add player to lobby
                const player = {
                    id: socket.user?.id,
                    username: socket.user?.username,
                    email: socket.user?.email || "",
                    isOnline: true,
                };
                // Check if player already exists
                const existingPlayerIndex = lobbyRoom.players.findIndex((p) => p.id === player.id);
                if (existingPlayerIndex >= 0) {
                    lobbyRoom.players[existingPlayerIndex] = player;
                }
                else {
                    lobbyRoom.players.push(player);
                }
                lobbyRooms.set(roomId, lobbyRoom);
                socket.join(roomId);
                // Send lobby update to all players in room
                gameNamespace.to(roomId).emit("lobby_update", {
                    players: lobbyRoom.players,
                    roomId: roomId,
                    isHost: lobbyRoom.players[0]?.id === socket.user?.id,
                    canStartGame: lobbyRoom.players.length === 2,
                });
            });
            socket.on("start_game", () => {
                const roomId = socket.user?.id || "default";
                const lobbyRoom = lobbyRooms.get(roomId);
                if (lobbyRoom && lobbyRoom.players.length === 2) {
                    // Initialize game with lobby players
                    const players = lobbyRoom.players.map((p) => ({
                        id: p.id,
                        username: p.username,
                    }));
                    initializeGameState(roomId, players);
                    // Notify all players to start game
                    gameNamespace.to(roomId).emit("game_start");
                    // Clean up lobby
                    lobbyRooms.delete(roomId);
                }
            });
            socket.on("leave_lobby", () => {
                const roomId = socket.user?.id || "default";
                const lobbyRoom = lobbyRooms.get(roomId);
                if (lobbyRoom) {
                    lobbyRoom.players = lobbyRoom.players.filter((p) => p.id !== socket.user?.id);
                    if (lobbyRoom.players.length === 0) {
                        lobbyRooms.delete(roomId);
                    }
                    else {
                        lobbyRooms.set(roomId, lobbyRoom);
                        // Update remaining players
                        gameNamespace.to(roomId).emit("lobby_update", {
                            players: lobbyRoom.players,
                            roomId: roomId,
                            isHost: lobbyRoom.players[0]?.id === lobbyRoom.players[0]?.id,
                            canStartGame: lobbyRoom.players.length === 2,
                        });
                    }
                }
                socket.leave(roomId);
            });
            socket.on("disconnect", () => {
                console.log(`User disconnected: ${socket.user?.username}`);
                // Handle game disconnection
                if (gameRooms.has(roomId)) {
                    const room = gameRooms.get(roomId);
                    if (room.isRoundActive) {
                        // If game is active, end it and notify other player
                        clearInterval(room.timerId);
                        gameNamespace.to(roomId).emit("player_disconnected", {
                            message: "Other player disconnected. Returning to lobby.",
                        });
                        gameRooms.delete(roomId);
                    }
                }
                // Handle lobby disconnection
                const lobbyRoom = lobbyRooms.get(roomId);
                if (lobbyRoom) {
                    lobbyRoom.players = lobbyRoom.players.filter((p) => p.id !== socket.user?.id);
                    if (lobbyRoom.players.length === 0) {
                        lobbyRooms.delete(roomId);
                    }
                    else {
                        lobbyRooms.set(roomId, lobbyRoom);
                        // Update remaining players
                        gameNamespace.to(roomId).emit("lobby_update", {
                            players: lobbyRoom.players,
                            roomId: roomId,
                            isHost: lobbyRoom.players[0]?.id === lobbyRoom.players[0]?.id,
                            canStartGame: lobbyRoom.players.length === 2,
                        });
                    }
                }
                // Clean up after delay
                setTimeout(() => {
                    const clientsInRoom = gameNamespace.adapter.rooms.get(roomId);
                    if (!clientsInRoom || clientsInRoom.size === 0) {
                        if (gameRooms.has(roomId)) {
                            console.log(`[State Cleanup] Room ${roomId} is empty. Deleting game state.`);
                            clearInterval(gameRooms.get(roomId).timerId);
                            gameRooms.delete(roomId);
                        }
                    }
                }, 5000);
            });
        }
        catch (error) {
            console.error("Socket connection error:", error);
            socket.disconnect(true);
        }
    });
};
exports.registerGameHandlers = registerGameHandlers;
