"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 * Hashes a plaintext password using bcrypt.
 * This is an asynchronous operation.
 *
 * @param password - The plaintext password to hash.
 * @returns A promise that resolves to the hashed password string.
 */
const hashPassword = (password) => {
    // The second argument is the "salt round" or cost factor.
    // A higher number is more secure but takes longer to compute.
    // 12 is a good, modern default.
    return bcryptjs_1.default.hash(password, 10);
};
exports.hashPassword = hashPassword;
/**
 * Compares a plaintext password against a previously generated hash.
 * This is an asynchronous operation.
 *
 * @param plaintextPassword - The password provided by the user during login.
 * @param hashedPassword - The hash stored in the database.
 * @returns A promise that resolves to `true` if the passwords match, otherwise `false`.
 */
const comparePassword = (plaintextPassword, hashedPassword) => {
    return bcryptjs_1.default.compare(plaintextPassword, hashedPassword);
};
exports.comparePassword = comparePassword;
