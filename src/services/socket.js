// MCMove/src/services/socket.js
import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_BACKEND_URL?.replace("/api", "") ||
  "http://localhost:5000";

const socket = io(SOCKET_URL, {
  auth: {
    token: localStorage.getItem("token"),
  },
  autoConnect: false, // We connect manually after login
});

export default socket;
