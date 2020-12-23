/*this.canvas.width = width;
this.canvas.height = consoleHeight - 60;

globalBounds = { x: 0, y: 60, w: width, h: consoleHeight - 60 };*/

let globalBounds = { x: 0, y: 0, w: 10, h: 10 };

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

//height = testerGameWindow.canvas.style.height;
//width = testerGameWindow.canvas.style.width;

/* Global Vars */

let color = {
  red: "red",
  blue: "blue",
  green: "green",
  yellow: "yellow",
  purple: "purple",
  cyan: "cyan",
  orange: "orange",
  gold: "gold",
  white: "white",
  black: "black",
};

/* Math & Calculations */

function inArea(X, Y, x, y, w, h) {
  if (X > x - 1 && Y > y - 1 && X < x + w && Y < y + h) {
    return true;
  } else {
    return false;
  }
}

//returns the offset from the actual Corner of the screen
export function getOffset() {
  return { x: window.canvas.offsetLeft, y: window.canvas.offsetTop };
}

/* Rendering */

function fill(col) {
  ctx.fillStyle = col;
}

function rect(x, y, w, h) {
  ctx.fillRect(x, y, w, h);
}

function background(col) {
  ctx.fillStyle = col;
  //globalBounds = { x: 0, y: 60, w: width, h: consoleHeight - 60 };
  ctx.fillRect(0, 0, window.canvas.width, window.canvas.height);
}
