"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, select: false },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    rollNumber: { type: String, required: true, unique: true, trim: true },
    teamName: { type: String, trim: true, default: "info" },
    gamesPlayed: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    achievements: { type: [String], default: [] },
    isAdmin: { type: Boolean, default: false },
}, { timestamps: true });
exports.User = (0, mongoose_1.model)("User", userSchema);
