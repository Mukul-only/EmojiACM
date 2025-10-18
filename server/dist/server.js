"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = __importDefault(require("./config"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const game_routes_1 = __importDefault(require("./routes/game.routes"));
const movie_routes_1 = __importDefault(require("./routes/movie.routes"));
const seed_routes_1 = __importDefault(require("./routes/seed.routes"));
const socket_auth_middleware_1 = require("./middleware/socket.auth.middleware");
const game_handler_1 = require("./sockets/game.handler");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: config_1.default.clientOrigin,
        credentials: true,
    },
});
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: config_1.default.clientOrigin, credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/game", game_routes_1.default);
app.use("/api/movies", movie_routes_1.default);
app.use("/api/seed", seed_routes_1.default);
app.use("/", (req, res) => {
    res.send({ success: "Yes" });
});
// Socket.IO
io.of("/game").use(socket_auth_middleware_1.socketAuthMiddleware);
(0, game_handler_1.registerGameHandlers)(io);
// Database Connection
mongoose_1.default
    .connect(config_1.default.mongoUri)
    .then(() => {
    console.log("MongoDB connected successfully.");
    server.listen(config_1.default.port, () => {
        console.log(`Server running on port ${config_1.default.port}`);
    });
})
    .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
});
