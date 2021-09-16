const mvmspeed = 1;

function movePlayer(block) {
  if (!terrain) return;
  localX = X;
  localY = Y;
  console.log(key);
  console.log(block);
  if (!block) {
    switch (key) {
      case "w":
      case "W":
      case "ArrowUp":
        moveUp();
        break;
      case "s":
      case "S":
      case "ArrowDown":
        moveDown();
        break;
      case "a":
      case "A":
      case "ArrowLeft":
        moveLeft();
        break;
      case "d":
      case "D":
      case "ArrowRight":
        moveRight();
        break;
    }
  }
  if (block) {
    const deltaX = thisPlayer.x - block.x;
    const deltaY = thisPlayer.y - block.y;
    sendMovePlayer(
      thisPlayer.name,
      thisPlayer.x - deltaX,
      thisPlayer.y - deltaY
    );
  }
}

function sendMovePlayer(name, x, y) {
  x = clampNumber(x, 0, terrain.width - 1);
  y = clampNumber(y, 0, terrain.height - 1);
  if (socket) {
    socket.emit("players:move", {
      player: { name },
      move: { x, y },
    });
    socket.emit("terrain:chunk", {
      player: { name: playerName },
      chunks: terrain.chunks.map((chunk) => chunk.id),
    });
    socket.emit("buildings:requestUpdate", {
      player: { name: playerName },
    });
  }
}

function moveDown() {
  sendMovePlayer(thisPlayer.name, thisPlayer.x, thisPlayer.y + 1);
}
function moveUp() {
  sendMovePlayer(thisPlayer.name, thisPlayer.x, thisPlayer.y - 1);
}
function moveLeft() {
  sendMovePlayer(thisPlayer.name, thisPlayer.x - 1, thisPlayer.y);
}
function moveRight() {
  sendMovePlayer(thisPlayer.name, thisPlayer.x + 1, thisPlayer.y);
}
function moveDownLeft() {
  sendMovePlayer(thisPlayer.name, thisPlayer.x - 1, thisPlayer.y + 1);
}
function moveDownRight() {
  sendMovePlayer(thisPlayer.name, thisPlayer.x + 1, thisPlayer.y + 1);
}
function moveUpLeft() {
  sendMovePlayer(thisPlayer.name, thisPlayer.x - 1, thisPlayer.y - 1);
}
function moveUpRight() {
  sendMovePlayer(thisPlayer.name, thisPlayer.x + 1, thisPlayer.y - 1);
}

window.addEventListener("load", () => {
  document.querySelector(".movement .up").addEventListener("click", moveUp);
  document.querySelector(".movement .down").addEventListener("click", moveDown);
  document.querySelector(".movement .left").addEventListener("click", moveLeft);
  document
    .querySelector(".movement .right")
    .addEventListener("click", moveRight);
  document
    .querySelector(".movement .up-left")
    .addEventListener("click", moveUpLeft);
  document
    .querySelector(".movement .up-right")
    .addEventListener("click", moveUpRight);
  document
    .querySelector(".movement .down-left")
    .addEventListener("click", moveDownLeft);
  document
    .querySelector(".movement .down-right")
    .addEventListener("click", moveDownRight);
});
