
import { io } from "socket.io-client";

export const socket = io("https://bharat-backend-44yj.onrender.com", {
  withCredentials: true,
});
