import { io, Socket } from "socket.io-client";
import fs from "fs";
import path from "path";

// Configuration
const TARGET_URL = "http://localhost:4000/game";
const SOCKET_PATH = "/socket.io/";
const USERS_FILE = path.join(__dirname, "../users.csv");
const DELAY_BETWEEN_USERS_MS = 50; // Stagger connections

interface UserData {
  username: string;
  token: string;
  roomId: string;
}

// Stats
const stats = {
  connected: 0,
  joinedLobby: 0,
  gameStarted: 0,
  roundStarted: 0,
  errors: 0,
  disconnects: 0,
};

// Read users
const usersFile = fs.readFileSync(USERS_FILE, "utf-8");
const users: UserData[] = usersFile
  .trim()
  .split("\n")
  .slice(1) // Skip header
  .map((line) => {
    const [username, token, roomId] = line.split(",");
    return { username, token, roomId };
  });

console.log(`Loaded ${users.length} users for stress test.`);

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function runUser(user: UserData, index: number) {
  const socket: Socket = io(TARGET_URL, {
    path: SOCKET_PATH,
    auth: {
      token: user.token,
    },
    transports: ["websocket", "polling"],
    forceNew: true,
  });

  socket.on("connect", () => {
    stats.connected++;
    // Wait for ready_to_join
  });

  socket.on("ready_to_join", () => {
     socket.emit("join_lobby");
  });

  socket.on("lobby_update", (data) => {
    if (!data.players) return;
    stats.joinedLobby++;
    
    // Check if we are host and can start game
    const onlineCount = data.players.filter((p: any) => p.isOnline).length;
    
    if (onlineCount === 2 && data.isHost) {
      // console.log(`[${user.username}] Starting game for room ${user.roomId}`);
      // 2. Start Game (Host only)
      setTimeout(() => {
        socket.emit("start_game", { roomId: user.roomId });
      }, 1000);
    }
  });

  socket.on("game_start", () => {
    stats.gameStarted++;
    // console.log(`[${user.username}] Game Started!`);
    
    // 3. Start Round (Everyone emits, server handles safety)
    setTimeout(() => {
      socket.emit("start_round");
    }, 2000);
  });

  socket.on("round_start", () => {
    stats.roundStarted++;
    // console.log(`[${user.username}] Round Started!`);

    // 4. Send some random activity
    setTimeout(() => {
      socket.emit("send_icon", { icon: "🧪" });
      socket.emit("submit_guess", { guess: "Test Movie" });
      
      // End test for this user after a bit
      setTimeout(() => {
        socket.disconnect();
      }, 5000);
    }, 1000);
  });

  socket.on("connect_error", (err) => {
    stats.errors++;
    console.error(`[${user.username}] Connection Error:`, err.message);
  });

  socket.on("error", (err) => {
    stats.errors++;
    console.error(`[${user.username}] Socket Error:`, err);
  });

  socket.on("disconnect", () => {
    stats.disconnects++;
  });
}

async function start() {
  console.log("Starting stress test...");
  
  for (let i = 0; i < users.length; i++) {
    runUser(users[i], i);
    await sleep(DELAY_BETWEEN_USERS_MS);
  }

  console.log("All users initiated. Monitoring...");

  // Print stats every second
  const interval = setInterval(() => {
    console.log("Stats:", JSON.stringify(stats));
    if (stats.disconnects >= users.length) {
      console.log("Test Complete.");
      clearInterval(interval);
      process.exit(0);
    }
  }, 2000);
}

start();
