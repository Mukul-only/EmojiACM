import { io } from "socket.io-client";
import fs from "fs";
import path from "path";

const usersFile = fs.readFileSync(path.join(__dirname, "../users.csv"), "utf-8");
const firstLine = usersFile.split("\n")[1]; // Skip header
const [username, token, roomId] = firstLine.split(",");

console.log(`Testing connection for ${username} to http://localhost:4000/game`);

const socket = io("http://localhost:4000/game", {
  path: "/socket.io/", // Matching server config
  auth: {
    token: token
  },
  transports: ["websocket", "polling"]
});

socket.on("connect", () => {
  console.log("SUCCESS: Connected!", socket.id);
  socket.disconnect();
});

socket.on("connect_error", (err) => {
  console.error("FAILURE: Connect Error:", err.message);
  // Log full error object if possible
  console.error(err);
  socket.close();
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});
