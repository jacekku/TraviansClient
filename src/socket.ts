import { io } from "socket.io-client";

const URL =
  window.location.href.includes("warlordsonline.net") ||
  window.location.href.includes("ssl.hwcdn.net")
    ? "https://warlordsonline.net:3000"
    : "http://" + window.location.hostname + ":3000";
const socket = io(URL, { secure: true, transports: ["websocket"] });
export { socket, URL };
