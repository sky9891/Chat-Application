import { io } from "socket.io-client";

// Use backend URL from environment variable
const SOCKET_URL = process.env.REACT_APP_API_URL.replace("/api", "");

// Create and export socket instance
export const socket = io(SOCKET_URL, {
  transports: ["websocket"], // ensure WebSocket is used
});
