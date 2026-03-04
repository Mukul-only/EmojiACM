"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string().min(3, "Username must be at least 3 characters"),
        password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
        name: zod_1.z.string().min(2, "Name must be at least 2 characters"),
        email: zod_1.z.string().email("Invalid email format"),
        rollNumber: zod_1.z.string().min(1, "Roll number is required"),
        teamName: zod_1.z.string().optional(),
    }),
});
// --- CHANGE IS HERE ---
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        // Renamed 'username' to 'identifier' to reflect its flexible nature.
        identifier: zod_1.z.string().min(1, "Identifier is required"),
        password: zod_1.z.string().min(1, "Password is required"),
    }),
});
// Emoji validation removed as we now use react-icons instead of emojis
