"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketAuthMiddleware = void 0;
// The 'cookie' import is no longer needed.
// import cookie from "cookie";
const jwt_1 = require("../utils/jwt");
const user_model_1 = require("../models/user.model");
const socketAuthMiddleware = async (socket, next) => {
    try {
        // 1. Look for the token in the handshake auth payload instead of cookies.
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error: No token provided."));
        }
        const decoded = (0, jwt_1.verifyJwt)(token);
        if (!decoded) {
            return next(new Error("Authentication error: Invalid token."));
        }
        const user = await user_model_1.User.findById(decoded.userId);
        if (!user) {
            return next(new Error("Authentication error: User not found."));
        }
        socket.user = { id: user.id, username: user.username };
        next();
    }
    catch (error) {
        next(new Error("Authentication error"));
    }
};
exports.socketAuthMiddleware = socketAuthMiddleware;
