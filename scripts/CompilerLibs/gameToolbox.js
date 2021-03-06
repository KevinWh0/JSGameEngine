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
      //keys[e.keyCode] = true;
      keys[e.key] = true;

      console.log(e.keyCode);
      keyPressed = e.key;
      currentKeypress = e.key;
      keyDown = true;

      var keyCode = e.keyCode || e.which;
      let currentKeyPressed = e.key;

      if (keyCode == 9) {
        e.preventDefault();
        currentKeyPressed = "Tab";
      }

      // Dispatch/Trigger/Fire the event
      document.dispatchEvent(
        new CustomEvent("keyDown", {
          detail: e.key,
        })
      );
    });
    window.addEventListener("keyup", function (e) {
      //keys[e.keyCode] = false;
      keys[e.key] = false;

      keyDown = false;
      keyReleased = true;
      currentKeypress = -1;
      releasedKey = e.key;
      //textholdTimers.set(e.key, undefined);
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

function inAreaBox(X, Y, W, H, x, y, w, h) {
  if (
    inArea(X, Y, x, y, w, h) ||
    inArea(X + W, Y, x, y, w, h) ||
    inArea(X + W, Y + H, x, y, w, h) ||
    inArea(X, Y + h, x, y, w, h)
  )
    return true;
  return false;
}

function getImage(img) {
  return assets.get(img).data;
}

//returns the offset from the actual Corner of the screen
export function getOffset() {
  return { x: gameCanvas.canvas.offsetLeft, y: gameCanvas.canvas.offsetTop };
}

function copyObject(obj) {
  let o = Object.create(obj);
  o.components = [];
  for (let i = 0; i < obj.components.length; i++) {
    o.components.push(Object.create(obj.components[i]));
  }
  return o;
}

Array.prototype.remove = function () {
  var what,
    a = arguments,
    L = a.length,
    ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

function removeObject(object) {
  objects.remove(object);
  //var index = objects.indexOf(object);
  //return removeItem(objects, index);
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

class GamePad {
  gamepad;
  id;
  controllerButtonMap = new Map();
  controllerJoysticks = new Map();
  totalButtons;
  totalJoysticks;
  mapping;
  setGamePad(gp) {
    this.gamepad = gp;
    this.totalButtons = gp.buttons.length;
    this.totalJoysticks = gp.axes.length / 2;
    this.mapping = gp.mapping;
    //console.log(this.totalJoysticks);
  }

  getButton(id) {
    try {
      return !this.controllerButtonMap.get(id)
        ? 0
        : this.controllerButtonMap.get(id);
    } catch (error) {
      console.error(error);
      return 0;
    }
  }

  getID() {
    return this.id;
  }

  vibrate(intesity, duration) {
    //Intensity 0 - 1
    //Duration in ms
    try {
      this.gamepad.vibrationActuator.playEffect(
        this.gamepad.vibrationActuator.type,
        {
          startDelay: 0,
          duration: duration,
          weakMagnitude: intesity,
          strongMagnitude: intesity,
        }
      );
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  getJoystickPosition(id) {
    try {
      return {
        x: !this.controllerJoysticks.get(id * 2)
          ? 0
          : this.controllerJoysticks.get(id * 2),
        y: !this.controllerJoysticks.get(id * 2 + 1)
          ? 0
          : this.controllerJoysticks.get(id * 2 + 1),
      };
    } catch (error) {
      return {
        x: 0,
        y: 0,
      };
    }
  }
}

function supportsGamepads() {
  return !!navigator.getGamepads;
}

let driftGuard = 0.2;
function setDriftGuardBounds(d) {
  driftGuard = d;
}

let _gamepads = navigator.getGamepads();
let controllerButtonMap = new Map();
let controllerJoysticks = new Map();

let gamepads = [];
let totalGamepads;

function updateGameController() {
  _gamepads = navigator.getGamepads();

  /*for(let i = 0; i < _gamepads.length; i++){
    gamepads = [];
    gamepads.push(new GamePad());
  }*/
  totalGamepads = 0;
  for (let i = 0; i < _gamepads.length; i++) {
    if (_gamepads[i] != null) totalGamepads++;
  }

  if (totalGamepads != gamepads.length) {
    if (totalGamepads < gamepads.length) gamepads.pop();
    else gamepads.push(new GamePad());
  }

  // For each controller, show all the button and axis information
  for (let i = 0; i < totalGamepads; i++) {
    let gp = _gamepads[i];
    gamepads[i].setGamePad(gp);
    gamepads[i].id = gp.id;
    if (!gp || !gp.connected) {
      continue;
    }
    for (let j = 0; j < gp.buttons.length; j++) {
      gamepads[i].controllerButtonMap.set(j, gp.buttons[j].value);
    }

    let axesBoxCount = ((gp.axes.length + 1) / 2) | 0; // Round up (e.g. 3 axes is 2 boxes)
    for (let j = 0; j < axesBoxCount; j++) {
      let xAxis = gp.axes[j * 2];
      gamepads[i].controllerJoysticks.set(
        j * 2,
        Math.abs(xAxis) > driftGuard ? xAxis : 0
      );
      if (!(j == axesBoxCount - 1 && gp.axes.length % 2 == 1)) {
        let yAxis = gp.axes[j * 2 + 1];
        gamepads[i].controllerJoysticks.set(
          j * 2 + 1,
          Math.abs(yAxis) > driftGuard ? yAxis : 0
        );
      }
    }
  }
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
let camera;

class GameObject {
  x;
  y;
  w;
  y;
  visualX;
  visualY;
  enabled = true;
  components = [];
  data = new Map();
  initDone = false;

  name;
  /* These are components that will only be active when the game is not exported */
  type;

  constructor(x, y, w, h, name, type, enabled) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.name = name;
    this.type = type;
    this.enabled = enabled;

    //this.type = "Object";
  }

  setType(type) {
    this.type = type;
    return this;
  }
  update() {
    if (this.enabled) {
      if (!this.initDone) {
        this.components.forEach((component) => {
          if (component.type == "script") {
            component.onStart(this);
          }
        });
        this.initDone = true;
      }
      this.visualX = this.x - camera.x;
      this.visualY = this.y - camera.y;
      this.components.forEach((component) => {
        component.run(this);
      });
    }
  }

  getComponent(type) {
    let c = [];
    this.components.forEach((component) => {
      if (component.componentName == type) c.push(component);
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
    rect(
      parentObject.visualX,
      parentObject.visualY,
      parentObject.w,
      parentObject.h
    );
  }

  setCol(col) {
    this.data.color = col;
  }
}

class ScriptComponent {
  type = "code";
  componentName = "Script";
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
    if (!!this.data.image && !!assets.get(this.data.image))
      renderImageGameCanvas(
        assets.get(this.data.image).getImage(),
        parentObject.visualX,
        parentObject.visualY,
        parentObject.w,
        parentObject.h
      );
  }
  setImg(imgName) {
    this.data.image = imgName;
  }
}

export class TextComponent {
  type = "visual";
  componentName = "Text";
  data = {
    text: undefined,
  };

  constructor(text) {
    if (text != undefined) this.data.text = text;
  }
  run(parentObject) {}

  setText(s) {
    this.data.text = s;
    return this;
  }

  getData() {
    return this.data.text;
  }
}

let objects = [];

let mapUsedObjects = new Map();
function getObject(name) {
  if (mapUsedObjects.get(name)) {
    return mapUsedObjects.get(name);
  }
  let obj;
  objects.forEach((e) => {
    if (name == e.name) {
      obj = e;
      mapUsedObjects.set(name, obj);
    }
  });
  return obj;
}

function getOverlappingObject(obj) {
  let arr = [];
  objects.forEach((o) => {
    if (o.type == "Object" && o != obj && o.enabled)
      if (
        inAreaBox(obj.x, obj.y, obj.w, obj.h, o.x, o.y, o.w, o.h) ||
        inAreaBox(o.x, o.y, o.w, o.h, obj.x, obj.y, obj.w, obj.h)
      ) {
        arr.push(o);
      }
  });
  return arr;
}

let frame = 0;
function runGameArea() {
  clearGameCanvas();

  //console.log(mousePressed);
  for (let i = 0; i < objects.length; i++) {
    objects[i].update();
  }
  camera.setWidth(window.innerWidth);
  camera.setHeight(window.innerHeight);
  resetMousePressed();
  updateGameController();
  frame++;
}

//INIT CAMERA
function init() {
  objects.forEach((e) => {
    console.log(e);
    if (e.type == "Camera") {
      camera = e;
    }
  });
}
