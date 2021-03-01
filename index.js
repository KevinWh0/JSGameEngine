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
  jsIcon,
  mainFont,
  setScriptOpen,
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
import { readFile } from "./scripts/GameObject/FileTypes/FileUploader.js";
import { objects, setObjects } from "./scripts/GameObject/ObjectHandler.js";
import { loadProject, saveProject } from "./scripts/SaveSystem.js";

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
  saveKey,
  findTextFitSize,
  UploadFile,
} from "./scripts/toolbox.js";
import {
  addToUILayer,
  ButtonWidget,
  roundRectangleGradientLook,
  runUILayer,
  textLook,
  UILayer,
  UIPopupPanel,
} from "./scripts/UIRendererLayer.js";

game.start();
var lastRender = Date.now();
export let fps;

setTitle("Aether Engine");
//setIcon("./icon.png");

let buttonsBar = new ButtonBar(10, 15, width, 40, "line");
buttonsBar.addButton("Game Editor", function () {
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

  addToUILayer(
    new UIPopupPanel(width / 2 - 150, height / 2 - 75, 300, 150, "Save Project")
      .addComponent(
        new ButtonWidget(250, 50, (widgetHolder) => {
          saveProject((saveFile) => {
            if (!project_name)
              project_name = prompt("What would you like to save this as?");
            //Check that the user has not hit cancel
            if (!!project_name) {
              if (scriptOpen != null) {
                let script = assets.get(scriptOpen);
                script.setScript(getCode());
                assets.set(scriptOpen, script);
                saveStar = "";
              }
              saveProject((saveFile) => {
                localStorage.setItem(project_name, saveFile);
              });
            }
          });
        })
          .overidePosition("CENTERX", "TOP")
          .addLooks(
            new roundRectangleGradientLook(secondaryUIColor, primaryUIColor)
          )
          .addLooks(new textLook("Save to localStorage", textUIColor))
      )
      .addComponent(
        new ButtonWidget(250, 50, (widgetHolder) => {
          saveProject((saveFile) => {
            let name = prompt("What would you like to save this as?");
            //Check that the user has not hit cancel

            if (!!name) {
              if (scriptOpen != null) {
                let script = assets.get(scriptOpen);
                script.setScript(getCode());
                assets.set(scriptOpen, script);
                saveStar = "";
              }
              download(saveFile, `${name}.json`, "txt");
            }
          });
        })
          .overidePosition("CENTERX", "BOTTOM")
          .addLooks(
            new roundRectangleGradientLook(secondaryUIColor, primaryUIColor)
          )
          .addLooks(new textLook("Dowload Physical Copy", textUIColor))
      )
  );

  /*saveProject((saveFile) => {
    //download(saveFile, "index.json", "txt");
    let name = prompt("What would you like to save this as?");
    project_name = name;
    localStorage.setItem(name, saveFile);
    alert(`Success Saving ${name}`);
  });*/
});

buttonsBar.addButton("Load Project", function () {
  /*
  (async () => {
    let name = prompt("What project would you like to load?");
    project_name = name;
    let project = localStorage.getItem(name);
    if (!!project) loadProject(project);
    else {
      let choices = "";
      for (let i = 0; i < localStorage.length; i++) {
        choices = choices + ` ${localStorage.key(i)},`;
      }
      choices = choices.substr(0, choices.length - 1);
      alert(
        `Error loading ${name}, please check the spelling.   Projects(${localStorage.length}) : ${choices}.`
      );
    }
  })();*/

  addToUILayer(
    new UIPopupPanel(width / 2 - 150, height / 2 - 75, 300, 150, "Load Project")
      .addComponent(
        new ButtonWidget(250, 50, (widgetHolder) => {
          try {
            (async () => {
              let name = prompt("What project would you like to load?");
              if (!name) return;
              project_name = name;
              let project = localStorage.getItem(name);
              if (!!project) loadProject(project);
              else {
                let choices = "";
                for (let i = 0; i < localStorage.length; i++) {
                  choices = choices + ` ${localStorage.key(i)},`;
                }
                choices = choices.substr(0, choices.length - 1);
                alert(
                  `Error loading ${name}, please check the spelling.   Projects(${localStorage.length}) : ${choices}.`
                );
              }
            })();

            //if any script is open, close it and put the user on the game scene
            setScriptOpen(null);
            setState(states.gameViewer);
            document.getElementById("codeWrapper").style.display = "none";
          } catch (err) {
            alert("Error loading project: Error code: " + err);
          }
        })
          .overidePosition("CENTERX", "TOP")
          .addLooks(
            new roundRectangleGradientLook(secondaryUIColor, primaryUIColor)
          )
          .addLooks(new textLook("load from localStorage", textUIColor))
      )
      .addComponent(
        new ButtonWidget(250, 50, (widgetHolder) => {
          try {
            UploadFile((files) => {
              let file = files[0];
              readFile(file, (data) => {
                loadProject(data);
              });
            });
            //if any script is open, close it and put the user on the game scene
            setScriptOpen(null);
            setState(states.gameViewer);
            document.getElementById("codeWrapper").style.display = "none";
          } catch (err) {
            alert("Error loading project: Error code: " + err);
          }
        })
          .overidePosition("CENTERX", "BOTTOM")
          .addLooks(
            new roundRectangleGradientLook(secondaryUIColor, primaryUIColor)
          )
          .addLooks(new textLook("Upload Project", textUIColor))
      )
  );
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
      width - getTextWidth(`Now Editing: ${scriptOpen}`) - 50,
      26
    );
    text(
      `${scriptOpen + saveStar}`,
      width - getTextWidth(`Now Editing: ${scriptOpen + saveStar}`) - 50,
      56
    );
    renderImage(jsIcon, width - getTextWidth(`Now Editing:`) - 50, 30, 30, 30);
    //setFontSize(12, "Ubuntu");

    lineButton("Save", width - 80, 0, 70, 50, 25, () => {
      if (!project_name)
        project_name = prompt("What would you like to save this as?");
      //Check that the user has not hit cancel
      if (!!project_name) {
        let script = assets.get(scriptOpen);
        script.setScript(getCode());
        assets.set(scriptOpen, script);
        saveStar = "";
        saveProject((saveFile) => {
          localStorage.setItem(project_name, saveFile);
        });
      }
    });
  } else if (state == states.gameViewer) {
    runUI();
  }

  //Cmd S Will save it
  if (saveKey) {
    if (!project_name)
      project_name = prompt("What would you like to save this as?");
    //Check that the user has not hit cancel
    if (!!project_name) {
      let script = assets.get(scriptOpen);
      //If no script is open, dont bother to save it
      if (!!script) {
        script.setScript(getCode());
        assets.set(scriptOpen, script);
        saveStar = "";
      }
      //Save the whole project
      saveProject((saveFile) => {
        localStorage.setItem(project_name, saveFile);
      });
    }
  }

  setFontSize(20, mainFont);

  try {
    stateCode.get(state)(game.frameNo);
  } catch (err) {
    console.error("State Does not exist.  " + err);
  }
  runUILayer();

  drawConsole();

  resetMousePressed();
}
UILayer.start();
