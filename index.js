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
import { assets, setAssets } from "./scripts/GameAssets/AssetHandler.js";
import { runUI } from "./scripts/GameEditorTools/GameEditorUI.js";
import { clearGameCanvas } from "./scripts/GameLibs/gameCanvasRendering.js";
import { objects, setObjects } from "./scripts/GameObject/ObjectHandler.js";
import { saveProject } from "./scripts/SaveSystem.js";

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
  lineButton,
} from "./scripts/toolbox.js";
import localforage from "./localstorageLib/localforage.js";

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
let project_name;
buttonsBar.addButton("Save Project", function () {
  //compileGame((code) => {
  //download(code, "index.html", "html");
  //});
  saveProject((saveFile) => {
    //download(saveFile, "index.txt", "txt");
  });
  /*
  let projectName =
    project_name || prompt("What would you like to save the project as?");
  if (!!projectName) {
    project_name = projectName;
    localforage
      .setItem(project_name + " - Objects", objects)
      .then(function (value) {
        // Do other things once the value has been saved.
        //console.log(value);
        console.log("Save Success!");
      })
      .catch(function (err) {
        alert(`Error Saving.    ${err}`);
        // This code runs if there were any errors
        //console.log(err);
      });

    localforage
      .setItem(project_name + " - Assets", assets)
      .then(function (value) {
        // Do other things once the value has been saved.
        //console.log(value);
        console.log("Save Success!");
      })
      .catch(function (err) {
        alert(`Error Saving.    ${err}`);
        // This code runs if there were any errors
        //console.log(err);
      });
  }*/
});

buttonsBar.addButton("Load Project", function () {
  let projectName =
    project_name || prompt("What project would you like to load?");
  if (!!projectName) {
    project_name = projectName;
    localforage
      .getItem(project_name + " - Objects")
      .then(function (value) {
        // This code runs once the value has been loaded
        // from the offline store.
        console.log(value);
        setObjects(value);
      })
      .catch(function (err) {
        // This code runs if there were any errors
        alert(`Error Loading.   ${err}`);
        console.log(err);
      });
    localforage
      .getItem(project_name + " - Assets")
      .then(function (value) {
        // This code runs once the value has been loaded
        // from the offline store.
        setAssets(value);
      })
      .catch(function (err) {
        // This code runs if there were any errors
        alert(`Error Loading.   ${err}`);
        console.log(err);
      });
  }
});

let saveStar = "";
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
    if (game.frameNo % 50 == 0) {
      if (assets.get(scriptOpen).data != getCode()) saveStar = "*";
      else saveStar = "";
    }
    text(
      `Now Editing:`,
      width - getTextWidth(`Now Editing: ${scriptOpen}`) - 20,
      26
    );
    text(
      `${scriptOpen + saveStar}`,
      width - getTextWidth(`Now Editing: ${scriptOpen + saveStar}`) - 20,
      56
    );
    renderImage(jsIcon, width - getTextWidth(`Now Editing:`) - 10, 30, 30, 30);
    //setFontSize(12, "Ubuntu");
    lineButton("Save", width - 80, 0, 70, 50, 25, () => {
      //alert(getCode());
      let script = assets.get(scriptOpen);
      script.setScript(getCode());
      assets.set(scriptOpen, script);
      saveStar = "";
    });
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
