"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = exports.signJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const { secret, expiresIn } = config_1.default.jwt;
/**
 * Creates and signs a new JSON Web Token.
 */
const signJwt = (payload) => {
    // We use a type assertion here. We know our `expiresIn` string is valid at runtime,
    // but TypeScript's strict "StringValue" type doesn't match our generic "string" type.
    // This tells TypeScript to trust us.
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
};
exports.signJwt = signJwt;
/**
 * Verifies a JSON Web Token.
 * @returns The decoded payload if the token is valid, otherwise null.
 */
const verifyJwt = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        return decoded;
    }
    catch (e) {
        // This will catch errors like expired tokens, invalid signatures, etc.
        return null;
    }
};
exports.verifyJwt = verifyJwt;
