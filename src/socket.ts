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
  return "http://" + window.location.hostname + "/api";
}

const URL = getURL();

const socket = io(URL, {
  reconnection: false,
  secure: true,
  transports: ["websocket"],
  autoConnect: false,
});

export { socket, URL };
