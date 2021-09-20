import { io } from "socket.io-client";
import Utilities from "./Utilities";

const URL =
  window.location.href.includes("warlordsonline.net") ||
  window.location.href.includes("ssl.hwcdn.net")
    ? "https://warlordsonline.net:3000"
    : "http://" + window.location.hostname + ":3000";
const socket = io(URL, { secure: true, transports: ["websocket"] });

function sendMovePlayer(
  name: string,
  x: number,
  y: number,
  terrain: any,
  chunks: any[]
) {
  x = Utilities.clampNumber(x, 0, terrain.width - 1);
  y = Utilities.clampNumber(y, 0, terrain.height - 1);
  if (socket) {
    socket.emit("players:move", {
      player: { name },
      move: { x, y },
    });
    socket.emit("terrain:chunk", {
      player: { name },
      chunks: chunks.map((chunk: any) => chunk.id),
    });
    socket.emit("buildings:requestUpdate", {
      player: { name },
    });
  }
}

export { socket, URL, sendMovePlayer };
