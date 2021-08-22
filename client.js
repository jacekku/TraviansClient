let socket;
let name;
let connected = false;
let X = 1,
  Y = 1;
let playerName;
terrain = "";
players = "";

function connect() {
  name = document.getElementById("name");
  playerName = name.value;
  // websocket = new WebSocket('wss://traviansserver.herokuapp.com/ws');
  socket = io("http://localhost:3000");
  socket.on("connect", onConnected);
  socket.on("message", (data) => console.warn("socket.on message: " + data));
  socket.on("disconnected", handleDisconnected);
  socket.on("players:all", (data) => {
    console.log(data);
  });

  socket.on("players:connect", handleConnected);
  socket.on("terrain:info", (data) => {
    console.log(data);
    terrain = data;
  });
}

function testWS(string) {
  socket.emit(string);
}

function onConnected() {
  socket.emit("players:connect", {
    player: {
      name: playerName,
    },
  });
  socket.emit("terrain:info");
}

function move(newPosition) {
  socket.emit("players:move", {
    player: {
      name: playerName,
    },
    move: newPosition,
  });
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

// function handleGetMessage(event) {
//   console.log(event);
//   if (event.data == "ERROR") {
//     connected = false;
//     return;
//   }
//   if (event.data == "CONNECTED") {
//     connected = true;
//     handleConnected();
//     return;
//   }
//   console.log(event.data);
//   const incomingData = JSON.parse(event.data);
//   if (incomingData.type == "TERRAIN") {
//     terrain = incomingData.data;
//     return;
//   }
//   if (incomingData.type == "PLAYERS") {
//     players = incomingData.data;
//     const thisPlayer = players.find((pl) => pl.name == playerName);
//     X = thisPlayer.x;
//     Y = thisPlayer.y;
//     return;
//   }
// }

function keyPressed() {
  movePlayer();
}

const mvmspeed = 1;

function movePlayer() {
  if (!terrain) return;
  localX = X;
  localY = Y;
  if (keyCode === LEFT_ARROW) {
    localX -= mvmspeed;
  } else if (keyCode === RIGHT_ARROW) {
    localX += mvmspeed;
  } else if (keyCode === UP_ARROW) {
    localY -= mvmspeed;
  } else if (keyCode === DOWN_ARROW) {
    localY += mvmspeed;
  }
  localX = clampNumber(localX, 0, terrain.width - 1);
  localY = clampNumber(localY, 0, terrain.height - 1);
  sendMovePlayer(playerName, localX, localY);
}

function sendMovePlayer(name, x, y) {
  if (socket) {
    socket.emit("players:move", {
      player: { name },
      move: { x, y },
    });
  }
}

function clampNumber(num, min, max) {
  return Math.min(Math.max(num, min), max);
}
