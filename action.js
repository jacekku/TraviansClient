function actionUp(e) {
  selectedBlock = findBlockByXY(thisPlayer.x, thisPlayer.y - 1);
  contextMenuEvent(e, selectedBlock);
}
function actionDown(e) {
  selectedBlock = findBlockByXY(thisPlayer.x, thisPlayer.y + 1);
  contextMenuEvent(e, selectedBlock);
}
function actionLeft(e) {
  selectedBlock = findBlockByXY(thisPlayer.x - 1, thisPlayer.y);
  contextMenuEvent(e, selectedBlock);
}
function actionRight(e) {
  selectedBlock = findBlockByXY(thisPlayer.x + 1, thisPlayer.y);
  contextMenuEvent(e, selectedBlock);
}
function actionUpLeft(e) {
  selectedBlock = findBlockByXY(thisPlayer.x - 1, thisPlayer.y - 1);
  contextMenuEvent(e, selectedBlock);
}

function actionUpRight(e) {
  selectedBlock = findBlockByXY(thisPlayer.x + 1, thisPlayer.y - 1);
  contextMenuEvent(e, selectedBlock);
}
function actionDownLeft(e) {
  selectedBlock = findBlockByXY(thisPlayer.x - 1, thisPlayer.y + 1);
  contextMenuEvent(e, selectedBlock);
}
function actionDownRight(e) {
  selectedBlock = findBlockByXY(thisPlayer.x + 1, thisPlayer.y + 1);
  contextMenuEvent(e, selectedBlock);
}

window.addEventListener("load", () => {
  document.querySelector(".actions .up").addEventListener("click", actionUp);
  document
    .querySelector(".actions .down")
    .addEventListener("click", actionDown);
  document
    .querySelector(".actions .left")
    .addEventListener("click", actionLeft);
  document
    .querySelector(".actions .right")
    .addEventListener("click", actionRight);
  document
    .querySelector(".actions .up-left")
    .addEventListener("click", actionUpLeft);
  document
    .querySelector(".actions .up-right")
    .addEventListener("click", actionUpRight);
  document
    .querySelector(".actions .down-left")
    .addEventListener("click", actionDownLeft);
  document
    .querySelector(".actions .down-right")
    .addEventListener("click", actionDownRight);

  document.querySelector(".actions .up").addEventListener("touchend", actionUp);
  document
    .querySelector(".actions .down")
    .addEventListener("touchend", actionDown);
  document
    .querySelector(".actions .left")
    .addEventListener("touchend", actionLeft);
  document
    .querySelector(".actions .right")
    .addEventListener("touchend", actionRight);
  document
    .querySelector(".actions .up-left")
    .addEventListener("touchend", actionUpLeft);
  document
    .querySelector(".actions .up-right")
    .addEventListener("touchend", actionUpRight);
  document
    .querySelector(".actions .down-left")
    .addEventListener("touchend", actionDownLeft);
  document
    .querySelector(".actions .down-right")
    .addEventListener("touchend", actionDownRight);
});
