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
  (async () => {
    let exportedAssets = "";
    let exportedObjects = "";
    let Assets = Array.from(assets.values());
    let AssetNames = Array.from(assets.keys());
    for (let i = 0; i < Assets.length; i++) {
      if (Assets[i].type == "Image" || Assets[i].type == "Audio") {
        exportedAssets =
          exportedAssets +
          `  assets.set("${AssetNames[i]}", new ${
            Assets[i].constructor.name
          }(${JSON.stringify(Assets[i].data.src)}));  `;
      } else {
        exportedAssets =
          exportedAssets +
          `  assets.set("${AssetNames[i]}", new ${
            Assets[i].constructor.name
          }(${JSON.stringify(Assets[i].data)}));  `;
      }
    }
    //exportedObjects
    for (let i = 0; i < objects.length; i++) {
      let objBuilder = `new GameObject(${objects[i].x}, ${objects[i].y}, ${objects[i].w}, ${objects[i].h}, "${objects[i].name}", ${objects[i].enabled})`;
      //These lines crash it
      let components = objects[i].components;
      try {
        components.forEach((component) => {
          objBuilder =
            objBuilder +
            `.addComponent(new ${
              component.constructor.name
            }("${component.getData()}"))`;
        });
        /*
        for (let j = 0; j < components.length; j++) {
          //console.log(components.length + " " + j);

          let comp = components.components[j];
          console.log(comp, j, components.length);
          objBuilder =
            objBuilder +
            `.addComponent(new ${comp.constructor.name}(${comp.getData()}))`;
        }*/
      } catch (err) {
        console.error(err);
      }

      exportedObjects = exportedObjects + `objects.push(${objBuilder});`;
    }

    var data = await readTextFile("scripts/GameLibs/gameToolbox.js");
    data = replaceAll(data, "export", "");
    data = replaceAll(data, `//!!!`, "");

    await playtestWindow.document.write(`
    <style>
    * {
      margin: 0;
      padding: 0;
    }
    </style>
    <div id="canvasHolder"></div>
    <script>    

      ${data}
      ${exportedAssets}
      ${exportedObjects}
    </script>
  `);
  })();
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
