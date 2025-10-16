import { Socket } from "socket.io";
// The 'cookie' import is no longer needed.
// import cookie from "cookie";
import { verifyJwt } from "../utils/jwt";
import { User } from "../models/user.model";

export interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    username: string;
  };
}

export const socketAuthMiddleware = async (
  socket: AuthenticatedSocket,
  next: (err?: Error) => void
) => {
  try {
    // 1. Look for the token in the handshake auth payload instead of cookies.
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error: No token provided."));
    }

    const decoded = verifyJwt(token);
    if (!decoded) {
      return next(new Error("Authentication error: Invalid token."));
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(new Error("Authentication error: User not found."));
    }

    socket.user = { id: user.id, username: user.username };

    next();
  } catch (error) {
    next(new Error("Authentication error"));
  }
};
