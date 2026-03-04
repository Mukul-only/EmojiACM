"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const socket_io_client_1 = require("socket.io-client");
// NOTE: This test assumes the server is running on localhost:4000
// It tests the authentication rejection, which doesn't require DB state modification.
(0, vitest_1.describe)('Socket Integration (Connection)', () => {
    const PORT = 4000;
    const URL = `http://localhost:${PORT}/game`;
    (0, vitest_1.it)('should fail to connect without authentication token', () => {
        return new Promise((resolve, reject) => {
            const socket = (0, socket_io_client_1.io)(URL, {
                auth: {}, // No token
                transports: ['websocket'],
                reconnection: false
            });
            socket.on('connect_error', (err) => {
                try {
                    // Expecting an authentication error message
                    // The server sends "Authentication error: No token provided."
                    (0, vitest_1.expect)(err.message).toMatch(/Authentication error/);
                    socket.close();
                    resolve();
                }
                catch (e) {
                    reject(e);
                }
            });
            socket.on('connect', () => {
                socket.close();
                reject(new Error('Socket should not have connected without token'));
            });
        });
    });
    (0, vitest_1.it)('should fail to connect with invalid token', () => {
        return new Promise((resolve, reject) => {
            const socket = (0, socket_io_client_1.io)(URL, {
                auth: { token: "invalid.token.string" },
                transports: ['websocket'],
                reconnection: false
            });
            socket.on('connect_error', (err) => {
                try {
                    (0, vitest_1.expect)(err.message).toMatch(/Authentication error/); // "Invalid token" or similar
                    socket.close();
                    resolve();
                }
                catch (e) {
                    reject(e);
                }
            });
            socket.on('connect', () => {
                socket.close();
                reject(new Error('Socket should not have connected with invalid token'));
            });
        });
    });
});
