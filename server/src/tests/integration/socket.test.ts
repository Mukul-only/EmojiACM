import { describe, it, expect } from 'vitest';
import { io as ioc } from 'socket.io-client';

// NOTE: This test assumes the server is running on localhost:4000
// It tests the authentication rejection, which doesn't require DB state modification.

describe('Socket Integration (Connection)', () => {
  const PORT = 4000;
  const URL = `http://localhost:${PORT}/game`;

  it('should fail to connect without authentication token', () => {
    return new Promise<void>((resolve, reject) => {
      const socket = ioc(URL, {
        auth: {}, // No token
        transports: ['websocket'],
        reconnection: false
      });

      socket.on('connect_error', (err) => {
        try {
          // Expecting an authentication error message
          // The server sends "Authentication error: No token provided."
          expect(err.message).toMatch(/Authentication error/);
          socket.close();
          resolve();
        } catch (e) {
          reject(e);
        }
      });

      socket.on('connect', () => {
        socket.close();
        reject(new Error('Socket should not have connected without token'));
      });
    });
  });

  it('should fail to connect with invalid token', () => {
    return new Promise<void>((resolve, reject) => {
        const socket = ioc(URL, {
          auth: { token: "invalid.token.string" }, 
          transports: ['websocket'],
          reconnection: false
        });
  
        socket.on('connect_error', (err) => {
          try {
            expect(err.message).toMatch(/Authentication error/); // "Invalid token" or similar
            socket.close();
            resolve();
          } catch (e) {
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
