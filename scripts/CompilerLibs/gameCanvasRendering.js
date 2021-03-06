let window = {
  canvas: document.getElementById("GameViewer"),
  getWidth: function () {
    return this.canvas.width;
  },
  getHeight: function () {
    return this.canvas.height;
  },
};
var ctx = window.canvas.getContext("2d");
export function clearGameCanvas() {
  ctx.clearRect(0, 0, window.canvas.width, window.canvas.height);
}
/* Rendering */

export function fillGameCanvas(col) {
  ctx.fillStyle = col;
}

export function rectGameCanvas(x, y, w, h) {
  ctx.fillRect(x, y, w, h);
}

export function renderImageGameCanvas(image, x, y, w, h) {
  ctx.mozImageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;

  ctx.drawImage(image, x, y, w, h);
}

function background(col) {
  ctx.fillStyle = col;
  //globalBounds = { x: 0, y: 60, w: width, h: consoleHeight - 60 };
  ctx.fillRect(0, 0, window.canvas.width, window.canvas.height);
}
