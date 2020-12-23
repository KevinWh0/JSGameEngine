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

/* Rendering */

export function fillGameCanvas(col) {
  ctx.fillStyle = col;
}

export function rectGameCanvas(x, y, w, h) {
  ctx.fillRect(x, y, w, h);
}

function background(col) {
  ctx.fillStyle = col;
  //globalBounds = { x: 0, y: 60, w: width, h: consoleHeight - 60 };
  ctx.fillRect(0, 0, window.canvas.width, window.canvas.height);
}
