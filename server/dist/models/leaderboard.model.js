"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Leaderboard = void 0;
const mongoose_1 = require("mongoose");
const leaderboardSchema = new mongoose_1.Schema({
    registrationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Registration",
        required: true,
        unique: true, // Ensures a team's single game session is only recorded once
    },
    teamName: {
        type: String,
        required: true,
    },
    members: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    ],
    score: {
        type: Number,
        required: true,
        default: 0,
    },
}, {
    timestamps: true,
});
// Add an index on the score for fast sorting of the leaderboard.
leaderboardSchema.index({ score: -1 });
exports.Leaderboard = (0, mongoose_1.model)("Leaderboard", leaderboardSchema);
