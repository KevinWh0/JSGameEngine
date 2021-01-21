/*this.canvas.width = width;
this.canvas.height = consoleHeight - 60;

globalBounds = { x: 0, y: 60, w: width, h: consoleHeight - 60 };*/

let globalBounds = { x: 0, y: 0, w: 10, h: 10 };

let keyPressed = -1;
let currentKeypress = -1;
let keyPushed = false;
let keyReleased = false;
let keys = new Array(255);
let releasedKey;

let width = window.innerWidth;
let height = window.innerHeight;

let mousePressed = false;
let mouseDown = false;
let keyDown = false;
function resetMousePressed() {
  mousePressed = false;
  keyReleased = false;
  keyPushed = false;
  releasedKey = "";
  keyHeldText = "";
}

let gameCanvas = {
  canvas:
    document.getElementById("GameViewer") || document.createElement("canvas"),
  getWidth: function () {
    return this.canvas.width;
  },
  getHeight: function () {
    return this.canvas.height;
  },
  start: function () {
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.id = "canvas";
    this.context = this.canvas.getContext("2d");
    document.getElementById("canvasHolder").appendChild(this.canvas);
    //document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    window.addEventListener("mousedown", function (e) {
      mousePressed = true;
      mouseDown = true;
    });
    window.addEventListener("mouseup", function (e) {
      mouseDown = false;
    });
    window.addEventListener("mousemove", function (e) {
      mouseX = e.x;
      mouseY = e.y;
    });
    window.addEventListener("keydown", function (e) {
      if (currentKeypress + "e" != (e.which || e.keyCode || e.charCode) + "e")
        keyPushed = true;
      keys[e.keyCode] = true;
      //console.log(e.keyCode);
      keyPressed = e.key;
      currentKeypress = e.key;
      keyDown = true;

      var keyCode = e.keyCode || e.which;
      let currentKeyPressed = e.key;

      if (keyCode == 9) {
        e.preventDefault();
        currentKeyPressed = "Tab";
      }

      if (!!textholdTimers.get(currentKeyPressed))
        textholdTimers.set(
          currentKeyPressed,
          textholdTimers.get(currentKeyPressed) + 1
        );
      if (textholdTimers.get(currentKeyPressed) > 20) {
        keyHeldText = currentKeyPressed;
      } else {
        textholdTimers.set(currentKeyPressed, 1);
        keyHeldText = currentKeyPressed;
      }
    });
    window.addEventListener("keyup", function (e) {
      keys[e.keyCode] = false;
      keyDown = false;
      keyReleased = true;
      currentKeypress = -1;
      releasedKey = e.key;
      textholdTimers.set(e.key, undefined);
      keyHeldText = "";
    });
    window.addEventListener("resize", function (e) {
      width = window.innerWidth;
      height = window.innerHeight;
      document.getElementById("canvas").width = width;
      document.getElementById("canvas").height = height;
    });

    this.interval = setInterval(runGameArea, Math.round(1000 / 60));
  },
};
//!!!     gameCanvas.start();

var ctx = gameCanvas.canvas.getContext("2d");
export function clearGameCanvas() {
  ctx.clearRect(0, 0, gameCanvas.canvas.width, gameCanvas.canvas.height);
}
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

function getImage(img) {
  return assets.get(img).data;
}

//returns the offset from the actual Corner of the screen
export function getOffset() {
  return { x: gameCanvas.canvas.offsetLeft, y: gameCanvas.canvas.offsetTop };
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
  ctx.fillRect(0, 0, gameCanvas.canvas.width, gameCanvas.canvas.height);
}

function renderImageGameCanvas(image, x, y, w, h) {
  ctx.mozImageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;

  ctx.drawImage(image, x, y, w, h);
}

function loadImg(url) {
  let img = new Image();
  img.src = url;
  return img;
}

//All the classes and components and stuff

let assets = new Map();

class FileObject {
  constructor(data) {
    this.data = data;
  }
  type = "" /*File type Goes here*/;
  data = "" /* General file data goes here*/;
}
class AudioObject extends FileObject {
  constructor(dataURL) {
    super();
    this.data = new Audio(dataURL);
    //this.data.src = dataURL;
    this.type = "Audio";
  }
  setAudio(dataURL) {
    this.data = dataURL;
  }
  getAudio() {
    return this.data;
  }

  play() {
    this.data.play();
  }
}
class ImageObject extends FileObject {
  constructor(dataURL) {
    super();
    this.data = new Image();
    this.data.src = dataURL;
    this.type = "Image";
  }
  setImage(dataURL) {
    this.data = dataURL;
  }
  getImage() {
    return this.data;
  }
}
class ScriptObject extends FileObject {
  constructor(code) {
    super();
    this.data = code;
    this.type = "Script";
  }

  setScript(code) {
    this.data = code;
  }
  getScript() {
    return this.data;
  }
}

//Objects

let inEditor = false;

class GameObject {
  x;
  y;
  w;
  y;
  enabled = true;
  components = [];
  data = new Map();

  name;
  /* These are components that will only be active when the game is not exported */
  type;

  constructor(x, y, w, h, name, enabled) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.name = name;
    this.enabled = enabled;
    this.type = "Object";
  }

  setType(type) {
    this.type = type;
    return this;
  }
  update() {
    if (this.enabled) {
      this.components.forEach((component) => {
        component.run(this);
      });
    }
  }

  getFirstComponent(type) {
    let c;
    this.components.forEach((component) => {
      if (component.componentName == type) c = component;
    });
    return c;
  }

  addComponent(component) {
    this.components.push(component);
    return this;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  setName(name) {
    this.name = name;
    return this;
  }
  setX(x) {
    this.x = x;
  }
  setY(y) {
    this.y = y;
  }

  setWidth(w) {
    this.w = w;
  }
  setHeight(h) {
    this.h = h;
  }
}

//Components

class RectangleObjectComponent {
  type = "visual";
  componentName = "Rectangle Component";
  data = {
    color: "purple",
  };

  constructor(color) {
    this.data.color = color;
  }

  run(parentObject) {
    fill(this.data.color);
    rect(parentObject.x, parentObject.y, parentObject.w, parentObject.h);
  }

  setCol(col) {
    this.data.color = col;
  }
}

class ScriptComponent {
  type = "code";
  componentName = "Script Component";
  data = {
    script: null,
  };

  constructor(script) {
    let data = assets.get(script).data;
    if (script != undefined) this.data.script = data;
  }

  run(parentObject) {
    if (this.data.script != undefined) {
      //!TODO remove eval
      eval(`${this.data.script} update(parentObject);`);
    }
  }

  setScript(s) {
    this.data.script = s;
  }
}

class TexturedObjectComponent {
  type = "visual";
  componentName = "Textured Component";
  data = {
    image: null,
  };

  constructor(img) {
    this.data.image = img;
  }

  run(parentObject) {
    //console.log(assets.get(this.data.image));
    if (this.data.image != null)
      renderImageGameCanvas(
        assets.get(this.data.image).getImage(),
        parentObject.x,
        parentObject.y,
        parentObject.w,
        parentObject.h
      );
  }
  setImg(imgName) {
    this.data.image = imgName;
  }
}

let objects = [];
function getObject(name) {
  let obj;
  objects.forEach((e) => {
    if (name == e.name) {
      obj = e;
    }
  });
  return obj;
}

function runGameArea() {
  clearGameCanvas();

  //console.log(mousePressed);
  for (let i = 0; i < objects.length; i++) {
    objects[i].update();
  }
  resetMousePressed();
}
