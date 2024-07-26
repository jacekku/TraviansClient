import { io } from "socket.io-client";

function getURL() {
  if (
    window.location.href.includes("warlordsonline.net") ||
    window.location.href.includes("ssl.hwcdn.net")
  ) {
    return "https://warlordsonline.net/api";
  }

  if (window.location.href.includes("warlords.jacekku.net")) {
    return "https://warlords.jacekku.net/api";
  }
  return "http://" + window.location.hostname + ":13000";
}

const URL = getURL();

const socket = io(URL.replace("/api", ""), {
  reconnection: false,
  secure: true,
  transports: ["websocket"],
  autoConnect: false,
  path: "/api/socket.io",
});

export { socket, URL };
