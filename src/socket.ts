import { io } from "socket.io-client";

const URL =
  window.location.href.includes("warlordsonline.net") ||
  window.location.href.includes("ssl.hwcdn.net")
    ? "https://warlordsonline.net/api"
    : "http://" + window.location.hostname + "/api";

const socket = io(URL, {
  reconnection: false,
  secure: true,
  transports: ["websocket"],
  autoConnect: false,
});

export { socket, URL };
