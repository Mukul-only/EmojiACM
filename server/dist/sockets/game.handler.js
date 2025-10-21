"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGameHandlers = void 0;
const registration_model_1 = require("../models/registration.model");
const leaderboard_model_1 = require("../models/leaderboard.model");
const gameHistory_model_1 = require("../models/gameHistory.model");
const user_model_1 = require("../models/user.model");
const movies_1 = require("../data/movies");
const gameRooms = new Map();
const lobbyRooms = new Map();
// Track socket to roomId mapping for reliable roomId retrieval
const socketRoomMap = new Map();
const TOTAL_ROUNDS = 14;
async function endGameAndSave(roomId, room, gameNamespace) {
    if (room.timerId)
        clearInterval(room.timerId);
    room.isRoundActive = false;
    try {
        const finalRegistration = await registration_model_1.Registration.findById(roomId);
        if (finalRegistration) {
            // Get user IDs from roll numbers
            const teamUsers = await user_model_1.User.find({
                rollNumber: { $in: finalRegistration.members },
            });
            const memberIds = teamUsers.map((user) => user._id);
            await leaderboard_model_1.Leaderboard.findOneAndUpdate({ registrationId: roomId }, {
                teamName: finalRegistration.groupName,
                members: memberIds,
                score: room.teamScore,
            }, { upsert: true, new: true, setDefaultsOnInsert: true });
            console.log(`[Leaderboard] Saved final score for team ${finalRegistration.groupName}: ${room.teamScore}`);
        }
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
    // Emit game_over without the score
    gameNamespace.to(roomId).emit("game_over", {
        message: "Game completed! Your score has been recorded.",
    });
    gameRooms.delete(roomId);
}
function initializeGameState(roomId, players) {
    // Ensure we have exactly two players
    if (players.length !== 2) {
        throw new Error("Game requires exactly two players");
    }
    // Randomly assign initial roles using more robust randomization
    const playersCopy = [...players]; // Create a copy to not modify the original array
    const randomIndex = Math.floor(Math.random() * 2); // 0 or 1
    const [clueGiver, guesser] = randomIndex === 0
        ? [playersCopy[0], playersCopy[1]]
        : [playersCopy[1], playersCopy[0]];
    console.log("[DEBUG] Assigning initial roles in room:", roomId, {
        clueGiver: clueGiver.username,
        guesser: guesser.username,
        clueGiverId: clueGiver.id,
        guesserId: guesser.id,
    });
    gameRooms.set(roomId, {
        players: new Map(players.map((p) => [p.id, { username: p.username }])),
        teamScore: 0,
        currentMovie: "",
        currentMovieData: null,
        currentIcons: [],
        guesserId: guesser.id,
        clueGiverId: clueGiver.id,
        timer: 90,
        isRoundActive: false,
        timerId: null,
        currentRound: 0,
        totalRounds: TOTAL_ROUNDS,
        gameStartTime: Date.now(),
        gameId: `game_${roomId}_${Date.now()}`,
        revealedWords: [], // Track which words have been revealed
        revealedLetters: new Set(), // Track which letter indices have been revealed
        maxRevealableLetters: 0, // 20% of total letters can be revealed
    });
}
const registerGameHandlers = (io) => {
    const gameNamespace = io.of("/game");
    gameNamespace.on("connection", async (socket) => {
        if (!socket.user) {
            socket.emit("error", { message: "Authentication failed." });
            socket.disconnect(true);
            return;
        }
        try {
            // Find if user is part of a team based on their roll number
            const user = await user_model_1.User.findById(socket.user.id);
            if (!user)
                throw new Error("User not found");
            console.log("[DEBUG] Looking for registration with roll number:", user.rollNumber);
            const registration = (await registration_model_1.Registration.findOne({
                members: { $all: [user.rollNumber] },
            }));
            console.log("[DEBUG] Registration found:", registration);
            if (!registration) {
                socket.emit("error", { message: "Not eligible for any game." });
                socket.disconnect(true);
                return;
            }
            const roomId = String(registration._id);
            socket.join(roomId);
            // Store the mapping for reliable roomId retrieval
            socketRoomMap.set(socket.id, roomId);
            console.log("[DEBUG] Initial Connection:", {
                username: socket.user.username,
                roomId: roomId,
                socketId: socket.id,
            });
            gameNamespace.to(roomId).emit("score_update", {
                teamScore: gameRooms.get(roomId)?.teamScore || 0,
            });
            socket.on("switch_roles", () => {
                const roomId = socketRoomMap.get(socket.id);
                if (!roomId) {
                    socket.emit("error", { message: "Room not found" });
                    return;
                }
                const room = gameRooms.get(roomId);
                if (room && !room.isRoundActive) {
                    // Switch roles using array destructuring
                    [room.clueGiverId, room.guesserId] = [
                        room.guesserId,
                        room.clueGiverId,
                    ];
                    console.log("[DEBUG] Roles manually switched in room:", roomId, {
                        clueGiverId: room.clueGiverId,
                        guesserId: room.guesserId,
                    });
                    gameNamespace.to(roomId).emit("roles_switched", {
                        clueGiverId: room.clueGiverId,
                        guesserId: room.guesserId,
                        message: "Roles have been manually switched! 🔄",
                    });
                }
                else {
                    socket.emit("error", {
                        message: "Cannot switch roles during an active round",
                    });
                }
            });
            socket.on("start_round", async () => {
                const roomId = socketRoomMap.get(socket.id);
                if (!roomId) {
                    socket.emit("error", { message: "Room not found" });
                    return;
                }
                const room = gameRooms.get(roomId);
                const currentClients = gameNamespace.adapter.rooms.get(roomId);
                if (room && !room.isRoundActive && currentClients?.size === 2) {
                    if (room.currentRound >= room.totalRounds) {
                        await endGameAndSave(roomId, room, gameNamespace);
                        return;
                    }
                    room.currentRound++;
                    room.isRoundActive = true;
                    const selectedMovie = (0, movies_1.getRandomMovie)();
                    room.currentMovie = selectedMovie.title;
                    room.currentMovieData = selectedMovie;
                    room.currentIcons = [];
                    room.timer = 90;
                    room.revealedWords = []; // Reset revealed words for new round
                    room.revealedLetters = new Set(); // Reset revealed letters
                    // Calculate 20% of total letters (excluding spaces)
                    const totalLetters = selectedMovie.title.replace(/ /g, "").length;
                    room.maxRevealableLetters = Math.ceil(totalLetters * 0.2);
                    // Use existing roles instead of reassigning
                    if (!room.clueGiverId || !room.guesserId) {
                        const playerIds = Array.from(room.players.keys());
                        room.clueGiverId = playerIds[0];
                        room.guesserId = playerIds[1];
                    }
                    // Send movie data only to clue giver, other data to everyone
                    gameNamespace.to(roomId).emit("round_start", {
                        clueGiverId: room.clueGiverId,
                        guesserId: room.guesserId,
                        movieToGuess: selectedMovie.title
                            .split(" ")
                            .map((word) => "_".repeat(word.length))
                            .join(" "),
                        currentRound: room.currentRound,
                        totalRounds: room.totalRounds,
                        isRoundActive: true,
                        timeLeft: 90,
                    });
                    // Send additional movie data only to clue giver using the room
                    const clueGiverSocket = Array.from(gameNamespace.sockets.values()).find((s) => s.user?.id === room.clueGiverId);
                    if (clueGiverSocket) {
                        gameNamespace.to(clueGiverSocket.id).emit("clue_giver_data", {
                            movieTitle: selectedMovie.title,
                            movieData: selectedMovie,
                        });
                    }
                    room.timerId = setInterval(() => {
                        room.timer--;
                        gameNamespace
                            .to(roomId)
                            .emit("timer_tick", { timeLeft: room.timer });
                        if (room.timer <= 0) {
                            clearInterval(room.timerId);
                            room.isRoundActive = false;
                            // Clear movie data at the end of the round
                            const movieTitle = room.currentMovie;
                            room.currentMovie = "";
                            room.currentMovieData = null;
                            room.currentIcons = [];
                            gameNamespace.to(roomId).emit("round_end", {
                                correct: false,
                                message: `Time's up! The movie was: ${movieTitle}`,
                                teamScore: room.teamScore,
                                movieData: null, // Explicitly clear movie data in client
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
            socket.on("forfeit_game", async () => {
                const roomId = socketRoomMap.get(socket.id);
                if (!roomId) {
                    socket.emit("error", { message: "Room not found" });
                    return;
                }
                const room = gameRooms.get(roomId);
                if (room) {
                    console.log(`[Game Forfeit] Team in room ${roomId} has forfeited the game.`);
                    room.teamScore = 0; // Set score to 0 as requested
                    await endGameAndSave(roomId, room, gameNamespace);
                }
            });
            socket.on("send_icon", ({ icon }) => {
                if (!socket.user)
                    return;
                const roomId = socketRoomMap.get(socket.id);
                if (!roomId)
                    return;
                const room = gameRooms.get(roomId);
                if (socket.user.id !== room?.clueGiverId) {
                    return socket.emit("error", {
                        message: "Only the Clue-Giver can send icons!",
                    });
                }
                if (room && room.isRoundActive) {
                    room.currentIcons.push(icon);
                    gameNamespace
                        .to(roomId)
                        .emit("icon_update", { icons: room.currentIcons });
                }
            });
            socket.on("delete_last_icon", () => {
                if (!socket.user)
                    return;
                const roomId = socketRoomMap.get(socket.id);
                if (!roomId)
                    return;
                const room = gameRooms.get(roomId);
                if (socket.user.id !== room?.clueGiverId) {
                    return socket.emit("error", {
                        message: "Only the Clue-Giver can edit clues!",
                    });
                }
                if (room && room.isRoundActive && room.currentIcons.length > 0) {
                    room.currentIcons.pop();
                    gameNamespace
                        .to(roomId)
                        .emit("icon_update", { icons: room.currentIcons });
                }
            });
            socket.on("clear_all_icons", () => {
                if (!socket.user)
                    return;
                const roomId = socketRoomMap.get(socket.id);
                if (!roomId)
                    return;
                const room = gameRooms.get(roomId);
                if (socket.user.id !== room?.clueGiverId) {
                    return socket.emit("error", {
                        message: "Only the Clue-Giver can edit clues!",
                    });
                }
                if (room && room.isRoundActive) {
                    room.currentIcons = [];
                    gameNamespace
                        .to(roomId)
                        .emit("icon_update", { icons: room.currentIcons });
                }
            });
            socket.on("check_letters", ({ input }) => {
                if (!socket.user)
                    return;
                const roomId = socketRoomMap.get(socket.id);
                if (!roomId)
                    return;
                const room = gameRooms.get(roomId);
                if (!room || !room.isRoundActive)
                    return;
                if (socket.user.id !== room.guesserId)
                    return;
                const movieTitleNoSpaces = room.currentMovie.replace(/ /g, "");
                const movieTitleLower = movieTitleNoSpaces.toLowerCase();
                const inputLower = input.replace(/ /g, "");
                // Check each character in input against movie title
                const revealedMap = {};
                for (let i = 0; i < inputLower.length; i++) {
                    const char = inputLower[i];
                    for (let j = 0; j < movieTitleLower.length; j++) {
                        if (movieTitleLower[j] === char && !room.revealedLetters.has(j)) {
                            // Only reveal if we haven't exceeded 10% limit
                            if (room.revealedLetters.size < room.maxRevealableLetters) {
                                room.revealedLetters.add(j);
                                revealedMap[j] = movieTitleNoSpaces[j]; // Store actual letter
                            }
                        }
                    }
                }
                // Send revealed map to guesser only (index -> letter)
                socket.emit("letters_revealed", {
                    revealedMap: revealedMap,
                });
            });
            socket.on("submit_guess", ({ guess }) => {
                if (!socket.user)
                    return;
                const roomId = socketRoomMap.get(socket.id);
                if (!roomId)
                    return;
                const room = gameRooms.get(roomId);
                if (socket.user.id !== room?.guesserId) {
                    return socket.emit("error", {
                        message: "Only the Guesser can submit a guess!",
                    });
                }
                if (room && room.isRoundActive) {
                    // Check if guess matches the full movie title
                    if (guess.toLowerCase().trim() ===
                        room.currentMovie.toLowerCase().trim()) {
                        clearInterval(room.timerId);
                        room.teamScore += room.timer;
                        room.isRoundActive = false;
                        // Swap roles after a successful guess
                        [room.clueGiverId, room.guesserId] = [
                            room.guesserId,
                            room.clueGiverId,
                        ];
                        console.log("[DEBUG] Roles switched after successful guess in room:", roomId, {
                            clueGiverId: room.clueGiverId,
                            guesserId: room.guesserId,
                        });
                        // Store movie title before clearing
                        const movieTitle = room.currentMovie;
                        // Clear movie data at the end of the round
                        room.currentMovie = "";
                        room.currentMovieData = null;
                        room.currentIcons = [];
                        room.revealedWords = [];
                        // First emit round_end
                        gameNamespace.to(roomId).emit("round_end", {
                            correct: true,
                            message: `${socket.user.username} guessed it! The movie was: ${movieTitle}`,
                            teamScore: room.teamScore,
                            movieData: null, // Explicitly clear movie data in client
                        });
                        // Then emit roles_switched with updated roles
                        gameNamespace.to(roomId).emit("roles_switched", {
                            clueGiverId: room.clueGiverId,
                            guesserId: room.guesserId,
                            message: "Roles have been switched for the next round! 🔄",
                        });
                    }
                    else {
                        // Check if the guess matches any word in the movie title
                        const movieWords = room.currentMovie.toLowerCase().split(" ");
                        const guessLower = guess.toLowerCase().trim();
                        let wordRevealed = false;
                        movieWords.forEach((word, index) => {
                            if (word === guessLower && !room.revealedWords.includes(index)) {
                                // 25% chance (1 in 4) to reveal the word
                                const shouldReveal = Math.random() < 0.25;
                                if (shouldReveal) {
                                    room.revealedWords.push(index);
                                    wordRevealed = true;
                                    // Generate updated movieToGuess with revealed words
                                    const updatedMovieToGuess = room.currentMovie
                                        .split(" ")
                                        .map((word, idx) => room.revealedWords.includes(idx)
                                        ? word
                                        : "_".repeat(word.length))
                                        .join(" ");
                                    // Emit word reveal update
                                    gameNamespace.to(roomId).emit("word_revealed", {
                                        movieToGuess: updatedMovieToGuess,
                                        revealedWord: word,
                                        message: `Lucky! The word "${room.currentMovie.split(" ")[index]}" has been revealed! 🎉`,
                                    });
                                }
                            }
                        });
                        if (!wordRevealed) {
                            socket.emit("guess_result", { correct: false });
                            gameNamespace.to(roomId).emit("new_incorrect_guess", {
                                guesserName: socket.user.username,
                                guess: guess,
                            });
                        }
                    }
                }
            });
            socket.on("join_lobby", async () => {
                if (!socket.user) {
                    socket.emit("error", { message: "Authentication required" });
                    return;
                }
                console.log("[DEBUG] Join Lobby - User:", socket.user.username);
                try {
                    // First get the user to find their roll number
                    const user = await user_model_1.User.findById(socket.user.id);
                    if (!user) {
                        socket.emit("error", { message: "User not found" });
                        return;
                    }
                    // Then find registration using roll number
                    const registration = await registration_model_1.Registration.findOne({
                        members: { $all: [user.rollNumber] },
                    });
                    if (!registration) {
                        socket.emit("error", { message: "No team registration found" });
                        return;
                    }
                    // Find all users with these roll numbers
                    const teamUsers = await user_model_1.User.find({
                        rollNumber: { $in: registration.members },
                    });
                    const roomId = String(registration._id);
                    // Ensure socket is in the room and mapping exists
                    socket.join(roomId);
                    socketRoomMap.set(socket.id, roomId);
                    const lobbyRoom = lobbyRooms.get(roomId) || {
                        players: [],
                        roomId: roomId,
                        teamName: registration.groupName,
                    };
                    console.log("[DEBUG] Joined room:", roomId);
                    const connectedSockets = gameNamespace.adapter.rooms.get(roomId);
                    console.log("[DEBUG] Connected sockets:", {
                        roomId,
                        sockets: Array.from(connectedSockets || []),
                    });
                    const onlineUserIds = new Set(Array.from(connectedSockets || [])
                        .map((socketId) => {
                        const socket = gameNamespace.sockets.get(socketId);
                        return socket?.user?.id;
                    })
                        .filter((id) => id));
                    const updatedPlayers = teamUsers.map((user) => ({
                        id: user._id.toString(),
                        username: user.username,
                        email: user.email,
                        name: user.name,
                        rollNumber: user.rollNumber,
                        teamName: registration.groupName,
                        isOnline: onlineUserIds.has(user._id.toString()),
                    }));
                    lobbyRoom.players = updatedPlayers;
                    lobbyRooms.set(roomId, lobbyRoom);
                    console.log("[DEBUG] Final lobby state:", {
                        playersCount: updatedPlayers.length,
                        onlinePlayers: updatedPlayers.filter((p) => p.isOnline).length,
                        socketRoomSize: connectedSockets?.size || 0,
                        currentPlayer: socket.user.username,
                    });
                    // Send lobby update to all players in the room
                    const currentConnectedSockets = gameNamespace.adapter.rooms.get(roomId);
                    const currentOnlineUserIds = new Set(Array.from(currentConnectedSockets || [])
                        .map((socketId) => {
                        const socket = gameNamespace.sockets.get(socketId);
                        return socket?.user?.id;
                    })
                        .filter((id) => id));
                    // Send individual lobby updates to each player with their correct host status
                    for (const playerId of currentOnlineUserIds) {
                        const playerSocket = Array.from(gameNamespace.sockets.values()).find((s) => s.user?.id === playerId);
                        if (playerSocket) {
                            const isHost = updatedPlayers[0]?.id === playerId;
                            playerSocket.emit("lobby_update", {
                                players: updatedPlayers,
                                roomId: roomId,
                                teamName: registration.groupName,
                                isHost: isHost,
                                canStartGame: currentOnlineUserIds.size === 2,
                            });
                        }
                    }
                }
                catch (error) {
                    console.error("Error in join_lobby:", error);
                    socket.emit("error", {
                        message: "Failed to join lobby. Please try again.",
                    });
                }
            });
            socket.on("start_game", async () => {
                if (!socket.user)
                    return;
                try {
                    // Get roomId from the socket mapping
                    const roomId = socketRoomMap.get(socket.id);
                    if (!roomId) {
                        console.error("[ERROR] RoomId not found for socket:", socket.id);
                        socket.emit("error", {
                            message: "Room not found. Please rejoin the lobby.",
                        });
                        return;
                    }
                    const lobbyRoom = lobbyRooms.get(roomId);
                    console.log("[DEBUG] Start Game Triggered:", {
                        roomId,
                        hasLobbyRoom: !!lobbyRoom,
                        playersInLobby: lobbyRoom?.players?.length,
                        onlinePlayerCount: lobbyRoom?.players?.filter((p) => p.isOnline).length,
                        currentUser: socket.user.username,
                    });
                    if (!lobbyRoom) {
                        socket.emit("error", {
                            message: "Lobby not found. Please try rejoining.",
                        });
                        return;
                    }
                    const onlinePlayers = lobbyRoom.players.filter((p) => p.isOnline);
                    if (onlinePlayers.length !== 2) {
                        socket.emit("error", {
                            message: "Need two online players to start the game.",
                        });
                        return;
                    }
                    const players = lobbyRoom.players.map((p) => ({
                        id: p.id,
                        username: p.name || p.username,
                        name: p.name,
                        rollNumber: p.rollNumber,
                    }));
                    initializeGameState(roomId, players);
                    const gameRoom = gameRooms.get(roomId);
                    // Notify players of initial roles
                    gameNamespace.to(roomId).emit("game_start", {
                        clueGiverId: gameRoom.clueGiverId,
                        guesserId: gameRoom.guesserId,
                        message: "Game starting! Players have been assigned their initial roles.",
                    });
                    // Also emit a roles_switched event for initial role assignment
                    gameNamespace.to(roomId).emit("roles_switched", {
                        clueGiverId: gameRoom.clueGiverId,
                        guesserId: gameRoom.guesserId,
                        message: "Initial roles have been assigned!",
                    });
                    // Reset used movies when starting a new game
                    (0, movies_1.resetUsedMovies)();
                    lobbyRooms.delete(roomId);
                    console.log("[DEBUG] Game started successfully for room:", roomId, {
                        clueGiverId: gameRoom.clueGiverId,
                        guesserId: gameRoom.guesserId,
                    });
                }
                catch (error) {
                    console.error("Error in start_game:", error);
                    socket.emit("error", { message: "Failed to start game" });
                }
            });
            socket.on("leave_lobby", async () => {
                if (!socket.user)
                    return;
                try {
                    const roomId = socketRoomMap.get(socket.id);
                    if (!roomId) {
                        socket.emit("error", { message: "Room not found" });
                        return;
                    }
                    const registration = await registration_model_1.Registration.findById(roomId).populate("members");
                    if (!registration) {
                        socket.emit("error", { message: "No team registration found" });
                        return;
                    }
                    const lobbyRoom = lobbyRooms.get(roomId);
                    if (lobbyRoom) {
                        const onlinePlayers = lobbyRoom.players.filter((p) => p.id !== socket.user?.id && p.isOnline);
                        const updatedPlayers = registration.members.map((member) => ({
                            id: member._id.toString(),
                            username: member.username,
                            email: member.email,
                            name: member.name,
                            rollNumber: member.rollNumber,
                            teamName: registration.groupName,
                            isOnline: member._id.toString() === socket.user?.id
                                ? false
                                : onlinePlayers.some((p) => p.id === member._id.toString()),
                        }));
                        if (onlinePlayers.length === 0) {
                            lobbyRooms.delete(roomId);
                        }
                        else {
                            lobbyRoom.players = updatedPlayers;
                            lobbyRooms.set(roomId, lobbyRoom);
                            // Send individual lobby updates to each player with their correct host status
                            const connectedSockets = gameNamespace.adapter.rooms.get(roomId);
                            const onlineUserIds = new Set(Array.from(connectedSockets || [])
                                .map((socketId) => {
                                const socket = gameNamespace.sockets.get(socketId);
                                return socket?.user?.id;
                            })
                                .filter((id) => id));
                            // Send individual lobby updates to each player with their correct host status
                            for (const playerId of onlineUserIds) {
                                const playerSocket = Array.from(gameNamespace.sockets.values()).find((s) => s.user?.id === playerId);
                                if (playerSocket) {
                                    const isHost = updatedPlayers[0]?.id === playerId;
                                    playerSocket.emit("lobby_update", {
                                        players: updatedPlayers,
                                        roomId: roomId,
                                        teamName: registration.groupName,
                                        isHost: isHost,
                                        canStartGame: onlinePlayers.length === 2,
                                    });
                                }
                            }
                        }
                    }
                    socket.leave(roomId);
                    socketRoomMap.delete(socket.id);
                }
                catch (error) {
                    console.error("Error in leave_lobby:", error);
                    socket.emit("error", { message: "Failed to leave lobby" });
                }
            });
            socket.on("disconnect", () => {
                console.log(`User disconnected: ${socket.user?.username}`);
                const roomId = socketRoomMap.get(socket.id);
                if (!roomId)
                    return;
                if (gameRooms.has(roomId)) {
                    const room = gameRooms.get(roomId);
                    if (room.isRoundActive) {
                        clearInterval(room.timerId);
                        gameNamespace.to(roomId).emit("player_disconnected", {
                            message: "Other player disconnected. Returning to lobby.",
                        });
                        gameRooms.delete(roomId);
                    }
                }
                const lobbyRoom = lobbyRooms.get(roomId);
                if (lobbyRoom && socket.user) {
                    const updatedPlayers = lobbyRoom.players.map((p) => p.id === socket.user?.id ? { ...p, isOnline: false } : p);
                    const onlinePlayers = updatedPlayers.filter((p) => p.isOnline);
                    if (onlinePlayers.length === 0) {
                        lobbyRooms.delete(roomId);
                    }
                    else {
                        lobbyRoom.players = updatedPlayers;
                        lobbyRooms.set(roomId, lobbyRoom);
                        // Send individual lobby updates to each player with their correct host status
                        const connectedSockets = gameNamespace.adapter.rooms.get(roomId);
                        const onlineUserIds = new Set(Array.from(connectedSockets || [])
                            .map((socketId) => {
                            const socket = gameNamespace.sockets.get(socketId);
                            return socket?.user?.id;
                        })
                            .filter((id) => id));
                        // Send individual lobby updates to each player with their correct host status
                        for (const playerId of onlineUserIds) {
                            const playerSocket = Array.from(gameNamespace.sockets.values()).find((s) => s.user?.id === playerId);
                            if (playerSocket) {
                                const isHost = lobbyRoom.players[0]?.id === playerId;
                                playerSocket.emit("lobby_update", {
                                    players: updatedPlayers,
                                    roomId: roomId,
                                    teamName: lobbyRoom.teamName,
                                    isHost: isHost,
                                    canStartGame: onlinePlayers.length === 2,
                                });
                            }
                        }
                    }
                }
                // Clean up socket mapping
                socketRoomMap.delete(socket.id);
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
            // Signal to the client that the server is ready for the join_lobby event
            socket.emit("ready_to_join");
        }
        catch (error) {
            console.error("Socket connection error:", error);
            socket.disconnect(true);
        }
    });
};
exports.registerGameHandlers = registerGameHandlers;
