import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import config from "./config";
import authRoutes from "./routes/auth.routes";
import gameRoutes from "./routes/game.routes";
import { socketAuthMiddleware } from "./middleware/socket.auth.middleware";
import { registerGameHandlers } from "./sockets/game.handler";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: config.clientOrigin,
    credentials: true,
  },
});

// Middleware
app.use(helmet());
app.use(cors({ origin: config.clientOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);

// Socket.IO
io.of("/game").use(socketAuthMiddleware);
registerGameHandlers(io);

// Database Connection
mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log("MongoDB connected successfully.");
    server.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
