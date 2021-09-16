let socket;
let name;
let connected = false;
let X = 1,
  Y = 1;
let playerName;
terrain = {};
players = "";
buildings = [];
console.log(window.location.hostname);
const URL = window.location.href.includes("warlordsonline.net")
  ? "https://warlordsonline.net:3000"
  : "http://" + window.location.hostname + ":3000";
function connect() {
  name = document.getElementById("name");
  playerName = name.value;
  socket = io(URL);
  socket.on("connect", onConnected);
  socket.on("message", (data) => console.log("socket.on message: " + data));
  socket.on("disconnected", handleDisconnected);
  socket.on("players:all", (data) => {
    updatePlayers(data);
  });

  socket.on("players:connect", handleConnected);
  socket.on("terrain:info", (data) => {
    const chunks = terrain.chunks;
    terrain = data;
    terrain.chunks = chunks;
  });
  socket.on("terrain:chunk", (data) => {
    const newChunks = data;
    if (!newChunks) return;
    if (!terrain.chunks) terrain.chunks = [];
    terrain.chunks.push(...newChunks);
  });

  socket.on("players:update", () => {
    socket.emit("players:requestUpdate", { player: { name: playerName } });
  });
  socket.on("buildings:update", () => {
    socket.emit("buildings:requestUpdate", { player: { name: playerName } });
  });
  socket.on("players:requestUpdate", (data) => {
    updatePlayers(data);
    __updateShow();
  });
  socket.on("buildings:requestUpdate", (data) => {
    updateBuildings(data);
    __updateShow();
  });
  socket.on("items:update", (data) => {
    updateInventory(data);
    __updateShow();
  });
  socket.on("exception", (data) => alert(JSON.stringify(data.message)));
}

function onConnected() {
  socket.emit("players:connect", {
    player: {
      name: playerName,
    },
  });
  socket.emit("players:requestUpdate", { player: { name: playerName } });
  fetch(URL + "/state/definitions")
    .then((data) => data.json())
    .then((data) => {
      ITEMS = data.itemDefinitions;
      return data;
    })
    .then((data) => {
      BUILDINGS = data.buildingDefinitions;
      return data;
    })
    .then((_) => socket.emit("items:update", { player: { name: playerName } }));
  socket.emit("terrain:info");
  socket.emit("terrain:chunk", { player: { name: playerName }, chunks: [] });
  socket.emit("buildings:requestUpdate", { player: { name: playerName } });
}

function handleConnected() {
  const login = document.getElementById("login");
  const game = document.getElementById("game");

  game.classList.remove("hidden");
  game.classList.add("visible");
  login.classList.remove("visible");
  login.classList.add("hidden");
}

function handleDisconnected() {
  const login = document.getElementById("login");
  const game = document.getElementById("game");

  game.classList.add("hidden");
  game.classList.remove("visible");
  login.classList.add("visible");
  login.classList.remove("hidden");
}

function keyPressed() {
  movePlayer();
}

function clampNumber(num, min, max) {
  return Math.min(Math.max(num, min), max);
}
function updatePlayers(newPlayers) {
  players = newPlayers;
  thisPlayer = players.find((player_) => playerName === player_.name);
  X = thisPlayer.x;
  Y = thisPlayer.y;
}
function updateBuildings(newBuildings) {
  buildings = newBuildings;
}
