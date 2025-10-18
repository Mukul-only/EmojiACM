"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameHistory = void 0;
const mongoose_1 = require("mongoose");
const gameHistorySchema = new mongoose_1.Schema({
    gameId: {
        type: String,
        required: true,
        unique: true,
    },
    players: [
        {
            id: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            username: {
                type: String,
                required: true,
            },
            role: {
                type: String,
                enum: ["clue-giver", "guesser"],
                required: true,
            },
        },
    ],
    finalScore: {
        type: Number,
        required: true,
        default: 0,
    },
    roundsPlayed: {
        type: Number,
        required: true,
        default: 0,
    },
    totalRounds: {
        type: Number,
        required: true,
        default: 25,
    },
    completedAt: {
        type: Date,
        default: Date.now,
    },
    duration: {
        type: Number,
        required: true,
        default: 0,
    },
}, {
    timestamps: true,
});
// Add indexes for efficient queries
gameHistorySchema.index({ "players.id": 1 });
gameHistorySchema.index({ completedAt: -1 });
exports.GameHistory = (0, mongoose_1.model)("GameHistory", gameHistorySchema);
