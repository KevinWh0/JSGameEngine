import {
  primaryUIColor,
  stateCode,
  state,
  states,
  setState,
  fileData,
  scriptOpen,
  textUIColor,
  secondaryUIColor,
  testerGameWindow,
  jsIcon,
} from "./scripts/AssetManager.js";
import { compileGame } from "./scripts/CodeCompiler.js";
import {
  addToConsole,
  drawConsole,
  getCode,
  running,
} from "./scripts/Console.js";
import { assets } from "./scripts/GameAssets/AssetHandler.js";
import { runUI } from "./scripts/GameEditorTools/GameEditorUI.js";
import { clearGameCanvas } from "./scripts/GameLibs/gameCanvasRendering.js";
import { objects } from "./scripts/GameObject/ObjectHandler.js";

import {
  game,
  text,
  textWraped,
  fill,
  setFontSize,
  renderImage,
  width,
  height,
  resetMousePressed,
  mousePressed,
  mouseDown,
  mouseX,
  mouseY,
  inArea,
  rect,
  keyPressed,
  keys,
  keyReleased,
  button,
  background,
  setTitle,
  ButtonBar,
  getTextWidth,
  replaceAll,
  readTextFile,
  download,
} from "./scripts/toolbox.js";

game.start();
var lastRender = Date.now();
export let fps;

setTitle("Game Engine!");
//setIcon("./icon.png");

let buttonsBar = new ButtonBar(10, 15, width, 40, "line");
buttonsBar.addButton("Game Viewer", function () {
  setState(states.gameViewer);
  document.getElementById("codeWrapper").style.display = "none";
});

buttonsBar.addButton("Scripting", function () {
  if (scriptOpen != null) {
    setState(states.scripting);
    document.getElementById("codeWrapper").style.display = "inline";
  }
});
let playtestWindow;
buttonsBar.addButton("Run", function () {
  /*
  if (running) {
    document.getElementById("stopVar").innerHTML = "true";
    buttonsBar.names[2] = "Run";
  } else {
    document.getElementById("stopVar").innerHTML = "false";
    compileCode(getCode());
    buttonsBar.names[2] = "Stop";
    setState(states.gameViewer);
    document.getElementById("codeWrapper").style.display = "none";
  }*/
  //if (playtestWindow != undefined) return;
  playtestWindow = window.open(
    "about:blank",
    "Game Preview",
    "width=600,height=600"
  );

  playtestWindow.focus();
  compileGame((code) => {
    playtestWindow.document.write(code);
  });
});

buttonsBar.addButton("Export", function () {
  compileGame((code) => {
    download(code, "index.html", "html");
  });
});

export function updateGameArea() {
  var delta = (Date.now() - lastRender) / 1000;
  lastRender = Date.now();
  fps = Math.round(1 / delta);
  game.clear();
  clearGameCanvas();
  game.frameNo += 1;
  background(secondaryUIColor);
  fill(textUIColor);

  buttonsBar.render();

  fill(textUIColor);
  if (state == states.scripting) {
    text(
      `Now Editing:`,
      width - getTextWidth(`Now Editing: ${scriptOpen}`) - 20,
      26
    );
    text(
      `${scriptOpen}`,
      width - getTextWidth(`Now Editing: ${scriptOpen}`) - 20,
      56
    );
    renderImage(jsIcon, width - getTextWidth(`Now Editing:`) - 10, 30, 30, 30);
  } else if (state == states.gameViewer) {
    runUI();
  }

  //if (mousePressed) addToConsole("Hello This is the console!", "white");
  //setFontSize(20, "Source Code Pro");
  //setFontSize(30, "Bebas Neue");
  setFontSize(20, "Ubuntu");

  try {
    stateCode.get(state)(game.frameNo);
  } catch (err) {
    console.error("State Does not exist.  " + err);
  }

  drawConsole();

  resetMousePressed();
}
