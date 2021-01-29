import { updateGameArea, fps } from "../index.js";
import {
  handleUI,
  primaryUIColor,
  secondaryUIColor,
  specialChars,
  textUIColor,
} from "./AssetManager.js";

export let width = window.innerWidth;
export let height = window.innerHeight;

export let mousePressed = false;
export let mouseDown = false;
export let keyDown = false;
export let saveKey = false;

export function resetMousePressed() {
  mousePressed = false;
  keyReleased = false;
  keyPushed = false;
  releasedKey = "";
  keyHeldText = "";
  saveKey = false;
}
export let mouseX, mouseY;
//WASD
export let controls = [87, 65, 83, 68];
export function setControls(c) {
  controls = c;
}
export let keyPressed = -1;
export let currentKeypress = -1;
export let keyPushed = false;
export let keyReleased = false;
export let keys = new Array(255);
export let releasedKey;

/* This is more for if you are creating a text box in your game */
export let keyHeldText;
let textholdTimers = new Map();

export let game = {
  canvas: document.createElement("canvas"),
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
      e.preventDefault();

      //console.log(event.keyCode);
    });
    window.addEventListener("keyup", function (e) {
      keys[e.keyCode] = false;
      keyDown = false;
      keyReleased = true;
      currentKeypress = -1;
      releasedKey = e.key;
      textholdTimers.set(e.key, undefined);
      keyHeldText = "";
      //Handle control S
      if (
        e.keyCode == 83 &&
        (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)
      ) {
        saveKey = true;
      }
    });
    try {
      window.addEventListener("resize", function (e) {
        width = window.innerWidth;
        height = window.innerHeight;
        document.getElementById("canvas").width = width;
        document.getElementById("canvas").height = height;
      });

      /*$(window).resize(function () {
        //resize just happened, pixels changed
        width = window.innerWidth;
        height = window.innerHeight;
        document.getElementById("canvas").width = width;
        document.getElementById("canvas").height = height;
      });*/
    } catch (error) {
      alert(
        "JQuery does not want to load, the game may behave unexpectedly without it"
      );
    }
    this.interval = setInterval(updateGameArea, Math.round(1000 / 60));
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};

export function fill(col) {
  game.context.fillStyle = col;
}

export function rect(x, y, w, h) {
  game.context.fillRect(x, y, w, h);
}

export function background(col) {
  game.context.fillStyle = col;
  game.context.fillRect(0, 0, width, height);
}

export function rectOutline(x, y, w, h, lnWidth) {
  var lnW = -lnWidth;
  rect(x, y, w, lnWidth);
  rect(x, y + h, w, lnW);
  rect(x + lnWidth, y, lnW, h);
  rect(x + w, y, lnW, h + lnW);
}

export function roundedRect(x, y, width, height, radius) {
  let ctx = game.context;
  if (typeof radius === "undefined") {
    radius = 5;
  }
  //ctx.fillRect(x, y, width, height);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

export function setFontSize(size, font) {
  game.context.font = size + "px " + font;
}

export function getFontSize() {
  return parseInt(game.context.font.split("px ")[0]);
}

export function getTextWidth(txt) {
  return game.context.measureText(txt).width;
}

export function centerText(txt, x, w) {
  return x + w / 2 - getTextWidth(txt) / 2;
}

export function text(text, x, y) {
  game.context.fillText(text, x, y);
}
/*
export function textWraped(text, x, y, fitWidth, lineHeight) {
  var context = game.context;
  fitWidth = fitWidth || 0;

  if (fitWidth <= 0) {
    context.fillText(text, x, y);
    return;
  }

  for (var idx = 1; idx <= text.length; idx++) {
    var str = text.substr(0, idx);
    //console.log(str, context.measureText(str).width, fitWidth);
    //console.log(text.substr(0, idx - 1));
    if (text.substr(0, idx + 2).substr(idx - 2, idx + 2) == "<NL>") {
      context.fillText(text.substr(0, idx - 2), x, y);

      textWraped(text.substr(idx + 2), x, y + lineHeight, fitWidth, lineHeight);
      return;
    }
    if (context.measureText(str).width > fitWidth) {
      context.fillText(text.substr(0, idx - 1), x, y);
      textWraped(text.substr(idx - 1), x, y + lineHeight, fitWidth, lineHeight);
      return;
    }
  }

  context.fillText(text, x, y);
}
*/
//same as textWrapped but it will return the onscreen position of the end of the text
export function textWraped(text, x, y, fitWidth, lineHeight) {
  var context = game.context;
  fitWidth = fitWidth || 0;

  if (fitWidth <= 0) {
    context.fillText(text, x, y);
    return;
  }
  let pos = null;
  for (var idx = 1; idx <= text.length; idx++) {
    var str = text.substr(0, idx);
    if (text.substr(0, idx + 4).endsWith("<TAB>")) {
      let txt = text.replace("<TAB>", "    ");
      textWraped(
        txt,
        x,
        y + (context.measureText(txt).width > fitWidth ? lineHeight : 0),
        fitWidth,
        lineHeight
      );
      return;
    }
    if (text.substr(0, idx + 2).substr(idx - 2, idx + 2) == "<NL>") {
      context.fillText(text.substr(0, idx - 2), x, y);

      textWraped(text.substr(idx + 2), x, y + lineHeight, fitWidth, lineHeight);
      return;
    }

    if (context.measureText(str).width > fitWidth) {
      context.fillText(text.substr(0, idx - 1), x, y);
      textWraped(text.substr(idx - 1), x, y + lineHeight, fitWidth, lineHeight);
      return;
    }
  }

  context.fillText(text, x, y);
}

export class advancedTextWrapped {
  pos = { x: 0, y: 0 };
  lineHeight;
  syntaxSheet;
  constructor(lineHeight, syntaxSheet) {
    //must be the same as the one used in text()
    this.lineHeight = lineHeight;
    this.syntaxSheet = syntaxSheet;
  }

  renderText(t, x, y, fitWidth, lineHeight) {
    let xOffset = 0;
    let yOffset = 0;
    let txt = t;
    //txt = txt.replace(new RegExp(specialChars.tab, "g"), "    ");
    txt = txt.replace(/(?:↹)/g, "    ");

    for (let i = 0; i < txt.length + 1; i++) {
      let textSoFar = txt.substr(0, i);
      xOffset += getTextWidth(txt.charAt(i - 1));

      if (xOffset > fitWidth || txt.charAt(i - 1) == specialChars.return) {
        yOffset += lineHeight;
        xOffset = 0;
      }
      if (txt.charAt(i - 1) != specialChars.return)
        text(textSoFar.charAt(i - 1), x + xOffset, y + yOffset);
    }
  }

  getPos() {
    return this.pos;
  }
}

let speakTick = 0;
export function resetStartSpeakTick() {
  speakTick = tick;
}
let yOffset = -50;
export function Speak(name, text, x, y, fitWidth, lineHeight) {
  fill("white");
  setFontSize(width / 30, "MainFont");
  textWraped(name, x, y, fitWidth, lineHeight);

  //textWraped(name, x + 10, y - 10, width - 40, 20);
  /*rectOutline(
    x,
    y,
    width - 40,
    height / 4 - 20,
    2
  );
  textWraped(
    text.substr(0, -(speakTick - tick)),
    45,
    height - height / 4 + 45 + yOffset,
    width - 80,
    width / 30
  );*/
}

export function outlinedText(text, x, y, thickness) {
  game.context.shadowColor = "black";
  game.context.shadowBlur = 1.4;
  game.context.lineWidth = thickness;
  game.context.strokeText(text, x, y);
  game.context.shadowBlur = 0;
  game.context.fillStyle = "white";
  game.context.fillText(text, x, y);
}

export function romanize(num) {
  if (isNaN(num)) return NaN;
  var digits = String(+num).split(""),
    key = [
      "",
      "C",
      "CC",
      "CCC",
      "CD",
      "D",
      "DC",
      "DCC",
      "DCCC",
      "CM",
      "",
      "X",
      "XX",
      "XXX",
      "XL",
      "L",
      "LX",
      "LXX",
      "LXXX",
      "XC",
      "",
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
    ],
    roman = "",
    i = 3;
  while (i--) roman = (key[+digits.pop() + i * 10] || "") + roman;
  return Array(+digits.join("") + 1).join("M") + roman;
}

export function getContext() {
  return game.context;
}

export function renderImage(image, x, y, w, h) {
  var upscaledCanvas = document.getElementById("canvas").getContext("2d");
  upscaledCanvas.mozImageSmoothingEnabled = false;
  upscaledCanvas.webkitImageSmoothingEnabled = false;
  upscaledCanvas.msImageSmoothingEnabled = false;
  upscaledCanvas.imageSmoothingEnabled = false;

  game.context.drawImage(image, x, y, w, h);
}

export function cropImage(img, x, y, w, h, cropX, cropY, cropW, cropH) {
  //var img = new Image();

  //img.src = image;
  var upscaledCanvas = document.getElementById("canvas").getContext("2d");

  upscaledCanvas.mozImageSmoothingEnabled = false;
  upscaledCanvas.webkitImageSmoothingEnabled = false;
  upscaledCanvas.msImageSmoothingEnabled = false;
  upscaledCanvas.imageSmoothingEnabled = false;
  upscaledCanvas.drawImage(img, cropX, cropY, cropW, cropH, x, y, w, h);

  //upscaledCanvas.drawImage(img, -x, -y, w - x, h -, x, y, cropW, cropH);
}

export function animateImg(img, speed, x, y, w, h, animYloc, cropW, cropH) {
  var upscaledCanvas = document.getElementById("canvas").getContext("2d");

  //(myGameArea.frameNo / speed) % ((StartX - StopX) / cropW);

  upscaledCanvas.mozImageSmoothingEnabled = false;
  upscaledCanvas.webkitImageSmoothingEnabled = false;
  upscaledCanvas.msImageSmoothingEnabled = false;
  upscaledCanvas.imageSmoothingEnabled = false;
  upscaledCanvas.drawImage(
    img,
    Math.round(((myGameArea.frameNo / speed) % (img.width - cropW)) / cropW) *
      cropW,
    animYloc,
    cropW,
    cropH,
    x,
    y,
    w,
    h
  );
}
export function rotate(x, y, deg) {
  var upscaledCanvas = document.getElementById("canvas").getContext("2d");
  upscaledCanvas.translate(x, y);
  upscaledCanvas.rotate((deg * Math.PI) / 180);
}
export function saveScreenSettings() {
  var upscaledCanvas = document.getElementById("canvas").getContext("2d");
  upscaledCanvas.save();
}
export function restoreScreenSettings() {
  var upscaledCanvas = document.getElementById("canvas").getContext("2d");
  upscaledCanvas.restore();
}

export function button(txt, x, y, w, h, textOffset, func) {
  var textWidth = getTextWidth(txt);
  if (inArea(mouseX, mouseY, x, y, w, h)) {
    if (mousePressed) {
      //buttonPress.play();
      func();
    }
    fill("yellow");
  } else fill("white");
  rectOutline(x, y, w, h, 3);
  text(txt, centerText(txt, x, w), y + textOffset);
}
export function lineButton(txt, x, y, w, h, textOffset, func) {
  var textWidth = getTextWidth(txt);
  if (inArea(mouseX, mouseY, x, y, w, h)) {
    if (mousePressed) {
      //buttonPress.play();
      func();
    }
    fill("yellow");
  } else fill("white");
  rect(x, y, w, 4);
  //roundedRect(x, y, w, 4, 4);
  text(txt, centerText(txt, x, w), y + textOffset);
}

export function toggleButton(txt1, txt2, x, y, w, h, textOffset, bool, func) {
  let txt = txt1;
  if (bool) txt = txt2;
  var textWidth = getTextWidth(txt);

  if (
    inArea(
      mouseX,
      mouseY,
      centerText(txt, x, 0) - textWidth * 0.25,
      y - 35,
      textWidth * 1.5,
      h
    )
  ) {
    if (mousePressed) {
      buttonPress.play();
      func(bool);
    }
    fill("yellow");
  } else fill("white");
  rectOutline(
    centerText(txt, x, 0) - textWidth * 0.25,
    y - 35,
    textWidth * 1.5,
    h,
    3
  );
  text(txt, centerText(txt, x, 0), y + textOffset);
}

export function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * @param {String} str - The main String
 * @param {String} a - The selector
 * @param {String} b - The thing that will replace the selector
 */
export function replaceAll(str, a, b) {
  return (str + a).split(a).join(b);
}

export function returnCopy(obj) {
  return $.extend(true, Object.create(Object.getPrototypeOf(obj)), obj);
}

export function jsonFromClass(obj, json) {
  return Object.assign(obj, json);
}

export function isPlaying(audio) {
  return !audio.paused;
}

export function stopGameMusic() {
  gameMusic.forEach((m) => {
    m.pause();
    m.currentTime = 0;
  });
}
export function isMusicListPlaying(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (isPlaying(arr[i])) return true;
  }
  return false;
}

export function playRandomSong(arr) {
  var musicID = Math.floor(Math.random() * arr.length);
  arr[musicID].currentTime = 0;
  arr[musicID].play();
}

export function inArea(X, Y, x, y, w, h) {
  if (X > x - 1 && Y > y - 1 && X < x + w && Y < y + h) {
    return true;
  } else {
    return false;
  }
}

export function inAreaBox(X, Y, W, H, x, y, w, h) {
  if (
    inArea(X, Y, x, y, w, h) ||
    inArea(X + W, Y, x, y, w, h) ||
    inArea(X + W, Y + H, x, y, w, h) ||
    inArea(X, Y + h, x, y, w, h)
  )
    return true;
  return false;
}

export function dist(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export function per60Frames(amtper60frames) {
  return (60 / fps) * amtper60frames;
}

export function removeItem(array, index) {
  return array.slice(0, index).concat(array.slice(index + 1, array.length));
}
export function RemoveItemByName(array, name) {
  let arr = array;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == name) {
      return removeItem(arr, i);
    }
  }
}

export function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

export function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

export const addNSecondsDelay = (n) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, n * 1000);
  });
};

var loadfileData;
export async function readTextFile(url) {
  /*
    NOTE:
    to use this you need to do somthing like this:
      (async () => {
      console.log(
        await readTextFile(
          "https://kevinwh0.github.io/SocialWeb/Online%20Chat%20Game/Maps/Home.txt"
        )
      });
    })();
    */
  const response = await fetch(url);
  return response.text();
}
// Function to download data to a file
export function download(data, filename, type) {
  var file = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob)
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else {
    // Others
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

export class ButtonBar {
  x;
  y;
  w;
  h;
  names = [];
  onClick = [];
  type = "";
  constructor(x, y, w, h, type) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.type = type;
    //this.names = names; //A array of strings
    //this.onClick = onClick;
  }

  render() {
    let x = this.x;
    for (let i = 0; i < this.names.length; i++) {
      if (this.type == "line") {
        lineButton(
          this.names[i],
          x,
          this.y,
          getTextWidth(this.names[i]) + 20,
          this.h,
          25,
          this.onClick[i]
        );
      } else
        button(
          this.names[i],
          x,
          this.y,
          getTextWidth(this.names[i]) + 20,
          this.h,
          25,
          this.onClick[i]
        );
      x += getTextWidth(this.names[i]) + 25;
    }
  }

  addButton(name, onClick) {
    this.names.push(name);
    this.onClick.push(onClick);
  }
  setY(y) {
    this.y = y;
  }
}

export function calculateRatio(num_1, num_2) {
  for (let num = num_2; num > 1; num--) {
    if (num_1 % num == 0 && num_2 % num == 0) {
      num_1 = num_1 / num;
      num_2 = num_2 / num;
    }
  }
  var ratio = [num_1, num_2];
  return ratio;
}

export function calculateDecimalRatio(num_1, num_2) {
  while (num_1 > 1 || num_2 > 1) {
    num_1 = (num_1 / 8) * 7;
    num_2 = (num_2 / 8) * 7;
  }
  var ratio = [num_1, num_2];
  return ratio;
}

export function UploadFile(callback) {
  let fileUploader = document.createElement("input");
  fileUploader.type = "file";
  fileUploader.multiple = true;
  fileUploader.click();
  fileUploader.addEventListener("change", (async) => {
    callback(fileUploader.files);
    //fileUploader.removeEventListener("change", null);
    fileUploader.remove();
  });
}

//Generic download world function
export function DownloadWorld() {
  var downloadData =
    worldWidth + " " + worldHeight + "\n" + spawnX + " " + spawnY + "\n";

  for (var i = 0; i < worldWidth; i++) {
    for (var j = 0; j < worldHeight; j++) {
      downloadData = downloadData + " " + map[i][j];
      //map[i][j] = Math.round(Math.random(2)) + 1;
    }
  }

  download(downloadData, "tst.txt", "test");
}
//Generic Load world
export function loadWorld(worldName) {
  //setLoadingLevel(true);
  (async () => {
    //loadfileData = await readTextFile(
    //"https://kevinwh0.github.io/SocialWeb/Online%20Chat%20Game/Maps/Home.txt"
    //);
    loadfileData = await readTextFile(worldName);
    var spl = loadfileData.split("\n");
    var dimentions = spl[0].split(" ");
    var spawnPos = spl[1].split(" ");
    var blocks = spl[2].split(" ");
    setMapSize(parseInt(dimentions[0]), parseInt(dimentions[1]));
    setSpawnPos(parseInt(spawnPos[0]), parseInt(spawnPos[1]));
    //console.log(spl);
    var i1 = 0;
    for (var i = 0; i < worldWidth; i++) {
      for (var j = 0; j < worldHeight; j++) {
        i1++;
        //map[i][j] = 0;
        map[i][j] = parseInt(blocks[i1]);
        //map[i][j] = Math.round(Math.random(2)) + 1;
      }
    }
    renderLvl();
    setLoadingLevel(false);
  })();
}

export function setIcon(url) {
  document.getElementById("Icon").href = url;
}

export function setTitle(title) {
  document.getElementById("Title").innerHTML = title;
}

export async function getDataOnClipboard() {
  navigator.clipboard
    .readText()
    .then((text) => {
      return text;
    })
    .catch((err) => {
      console.error("Failed to read clipboard contents: ", err);
    });
}

export async function getTextOnClipboard(func) {
  navigator.clipboard
    .readText()
    .then((text) => {
      func(text);
    })
    .catch((err) => {
      console.error("Failed to read clipboard contents: ", err);
    });
}

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    console.log("Fallback: Copying text command was " + msg);
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
}
export function copyToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(
    function () {
      console.log("Async: Copying to clipboard was successful!");
    },
    function (err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
}

export class PopupPanel {
  showing = false;
  components = [];

  constructor(x, y, w, h) {
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
  }

  run() {
    if (this.showing) {
      fill(secondaryUIColor);
      rect(this.x, this.y, this.w, this.h);
      fill(handleUI);
      rect(this.x, this.y, this.w, 30);
      let textX = this.x + this.w - getFontSize();
      let textY = this.y + getFontSize();

      if (
        inArea(
          mouseX,
          mouseY,
          textX,
          textY - getFontSize(),
          getFontSize(),
          getFontSize()
        )
      ) {
        if (mousePressed) this.showing = false;

        fill("crimson");
      } else {
        fill("red");
      }

      text("X", textX, textY);

      this.components.forEach((c) => {
        c.run(this, 0);
      });
    }
  }

  runAsPanel(func, extraPeram) {
    func(this, extraPeram);
  }

  toggleShow() {
    this.showing = !this.showing;
  }

  setShowing(s = true) {
    this.showing = s;
  }
  setSize(w, h) {
    this.w = w;
    this.h = h;
  }
  setPos(x, y) {
    this.x = x;
    this.y = y;
  }
  addComponent(c) {
    this.components.push(c);
    return this;
  }
  removeAllComponents() {
    this.components = [];
  }
}

export class Dropdown {
  x;
  y;
  w;
  h;
  expanded = false;
  onExpand = () => {};
  items = [];
  currentSelection = "No Image";
  pressedLastFrame = false; //For mousePress
  constructor(x, y, w, h) {
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
  }
  setText(s) {
    this.currentSelection = s;
    return this;
  }
  run(parentContainer, yOffset) {
    fill(primaryUIColor);
    rect(
      this.x + parentContainer.x,
      this.y + parentContainer.y,
      this.w,
      this.h
    );
    fill(textUIColor);
    text(
      this.currentSelection,
      this.x + parentContainer.x,
      this.y + parentContainer.y + getFontSize(),
      this.w,
      this.h
    );

    if (
      mousePressed &&
      inArea(
        mouseX,
        mouseY,
        this.x + parentContainer.x,
        this.y + parentContainer.y,
        this.w,
        this.h
      )
    ) {
      this.expanded = true;
      this.onExpand(this);
      this.pressedLastFrame = mousePressed;
    }
    if (this.expanded) {
      for (let i = 0; i < this.items.length; i++) {
        fill(primaryUIColor);

        rect(
          this.x + parentContainer.x,
          this.y + parentContainer.y - (i + 1) * this.h,
          this.w,
          this.h
        );
        fill(textUIColor);
        text(
          this.items[i],
          this.x + parentContainer.x,
          this.y + parentContainer.y + getFontSize() - (i + 1) * this.h,
          this.w,
          this.h
        );
        if (
          mousePressed &&
          !this.pressedLastFrame &&
          inArea(
            mouseX,
            mouseY,
            this.x + parentContainer.x,
            this.y + parentContainer.y - (i + 1) * this.h,
            this.w,
            this.h
          )
        ) {
          this.expanded = false;
          this.currentSelection = this.items[i];
        }
      }
    }
    this.pressedLastFrame = mousePressed;
  }

  addItem(name) {
    this.items.push(name);
    return this;
  }
  clearItems() {
    this.items = [];
  }
  setItems(arr) {
    this.items = arr;
    return this;
  }
  setOnExpand(func) {
    this.onExpand = func;
    return this;
  }
}

export function generateUUID() {
  // Public Domain/MIT
  var d = new Date().getTime(); //Timestamp
  var d2 = (performance && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
  return "xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function SHA256(s) {
  var chrsz = 8;
  var hexcase = 0;
  function safe_add(x, y) {
    var lsw = (x & 0xffff) + (y & 0xffff);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }
  function S(X, n) {
    return (X >>> n) | (X << (32 - n));
  }
  function R(X, n) {
    return X >>> n;
  }
  function Ch(x, y, z) {
    return (x & y) ^ (~x & z);
  }
  function Maj(x, y, z) {
    return (x & y) ^ (x & z) ^ (y & z);
  }
  function Sigma0256(x) {
    return S(x, 2) ^ S(x, 13) ^ S(x, 22);
  }
  function Sigma1256(x) {
    return S(x, 6) ^ S(x, 11) ^ S(x, 25);
  }
  function Gamma0256(x) {
    return S(x, 7) ^ S(x, 18) ^ R(x, 3);
  }
  function Gamma1256(x) {
    return S(x, 17) ^ S(x, 19) ^ R(x, 10);
  }
  function core_sha256(m, l) {
    var K = new Array(
      0x428a2f98,
      0x71374491,
      0xb5c0fbcf,
      0xe9b5dba5,
      0x3956c25b,
      0x59f111f1,
      0x923f82a4,
      0xab1c5ed5,
      0xd807aa98,
      0x12835b01,
      0x243185be,
      0x550c7dc3,
      0x72be5d74,
      0x80deb1fe,
      0x9bdc06a7,
      0xc19bf174,
      0xe49b69c1,
      0xefbe4786,
      0xfc19dc6,
      0x240ca1cc,
      0x2de92c6f,
      0x4a7484aa,
      0x5cb0a9dc,
      0x76f988da,
      0x983e5152,
      0xa831c66d,
      0xb00327c8,
      0xbf597fc7,
      0xc6e00bf3,
      0xd5a79147,
      0x6ca6351,
      0x14292967,
      0x27b70a85,
      0x2e1b2138,
      0x4d2c6dfc,
      0x53380d13,
      0x650a7354,
      0x766a0abb,
      0x81c2c92e,
      0x92722c85,
      0xa2bfe8a1,
      0xa81a664b,
      0xc24b8b70,
      0xc76c51a3,
      0xd192e819,
      0xd6990624,
      0xf40e3585,
      0x106aa070,
      0x19a4c116,
      0x1e376c08,
      0x2748774c,
      0x34b0bcb5,
      0x391c0cb3,
      0x4ed8aa4a,
      0x5b9cca4f,
      0x682e6ff3,
      0x748f82ee,
      0x78a5636f,
      0x84c87814,
      0x8cc70208,
      0x90befffa,
      0xa4506ceb,
      0xbef9a3f7,
      0xc67178f2
    );
    var HASH = new Array(
      0x6a09e667,
      0xbb67ae85,
      0x3c6ef372,
      0xa54ff53a,
      0x510e527f,
      0x9b05688c,
      0x1f83d9ab,
      0x5be0cd19
    );
    var W = new Array(64);
    var a, b, c, d, e, f, g, h, i, j;
    var T1, T2;
    m[l >> 5] |= 0x80 << (24 - (l % 32));
    m[(((l + 64) >> 9) << 4) + 15] = l;
    for (var i = 0; i < m.length; i += 16) {
      a = HASH[0];
      b = HASH[1];
      c = HASH[2];
      d = HASH[3];
      e = HASH[4];
      f = HASH[5];
      g = HASH[6];
      h = HASH[7];
      for (var j = 0; j < 64; j++) {
        if (j < 16) W[j] = m[j + i];
        else
          W[j] = safe_add(
            safe_add(
              safe_add(Gamma1256(W[j - 2]), W[j - 7]),
              Gamma0256(W[j - 15])
            ),
            W[j - 16]
          );
        T1 = safe_add(
          safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]),
          W[j]
        );
        T2 = safe_add(Sigma0256(a), Maj(a, b, c));
        h = g;
        g = f;
        f = e;
        e = safe_add(d, T1);
        d = c;
        c = b;
        b = a;
        a = safe_add(T1, T2);
      }
      HASH[0] = safe_add(a, HASH[0]);
      HASH[1] = safe_add(b, HASH[1]);
      HASH[2] = safe_add(c, HASH[2]);
      HASH[3] = safe_add(d, HASH[3]);
      HASH[4] = safe_add(e, HASH[4]);
      HASH[5] = safe_add(f, HASH[5]);
      HASH[6] = safe_add(g, HASH[6]);
      HASH[7] = safe_add(h, HASH[7]);
    }
    return HASH;
  }
  function str2binb(str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz) {
      bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - (i % 32));
    }
    return bin;
  }
  function Utf8Encode(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  }
  function binb2hex(binarray) {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i++) {
      str +=
        hex_tab.charAt((binarray[i >> 2] >> ((3 - (i % 4)) * 8 + 4)) & 0xf) +
        hex_tab.charAt((binarray[i >> 2] >> ((3 - (i % 4)) * 8)) & 0xf);
    }
    return str;
  }
  s = Utf8Encode(s);
  return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
}
