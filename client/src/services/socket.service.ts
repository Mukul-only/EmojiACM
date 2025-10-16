// client/src/services/socket.service.ts

import { io, Socket } from "socket.io-client";

const URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

class SocketService {
  public socket: Socket | null = null;

  // MODIFIED connect method to accept a token
  connect(namespace: string, token: string): Promise<Socket> {
    return new Promise((resolve, reject) => {
      if (this.socket && this.socket.connected) {
        resolve(this.socket);
        return;
      }

      // The 'withCredentials' option is no longer the primary auth method.
      // We now use the 'auth' payload, which is the recommended way.
      this.socket = io(`${URL}${namespace}`, {
        auth: {
          token: token,
        },
      });

      this.socket.on("connect", () => {
        console.log("Socket connected with token auth:", this.socket?.id);
        resolve(this.socket!);
      });

      this.socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
        reject(err);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
