"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const password_1 = require("../utils/password");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, select: false },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    rollNumber: { type: String, required: true, unique: true, trim: true },
    teamName: { type: String, trim: true },
    gamesPlayed: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    achievements: { type: [String], default: [] },
}, { timestamps: true });
userSchema.pre("save", async function (next) {
    if (this.isModified("password") && this.password) {
        this.password = await (0, password_1.hashPassword)(this.password);
    }
    next();
});
exports.User = (0, mongoose_1.model)("User", userSchema);
