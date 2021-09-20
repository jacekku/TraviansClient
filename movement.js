function movePlayer(block) {
  if (!terrain) return;
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
