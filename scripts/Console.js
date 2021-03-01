//import { assets } from "./GameObject/ObjectHandler.js";
import { assets } from "./GameAssets/AssetHandler.js";

import {
  handleUI,
  primaryUIColor,
  scriptOpen,
  secondaryUIColor,
  state,
  states,
  textUIColor,
  testerGameWindow,
  setTextboxHeight,
  fileIcon,
  uploadIcon,
  audioIcon,
  scriptIcon,
  plusIcon,
  setState,
  getDefaultStartFileCode,
  setScriptOpen,
} from "./AssetManager.js";
import {
  getDataUrl,
  readImage,
  readFile,
} from "./GameObject/FileTypes/FileUploader.js";
import {
  addNSecondsDelay,
  ButtonBar,
  centerText,
  fill,
  getTextWidth,
  height,
  inArea,
  mouseDown,
  mousePressed,
  mouseX,
  mouseY,
  readTextFile,
  rect,
  renderImage,
  replaceAll,
  setFontSize,
  text,
  textWraped,
  UploadFile,
  width,
  calculateRatio,
  calculateDecimalRatio,
  PopupPanel,
  getKeyByValue,
  resetMousePressed,
  setMouseDown,
} from "./toolbox.js";
import { ImageObject } from "./GameObject/FileTypes/Image.js";
import { FileObject } from "./GameObject/FileTypes/File.js";
import { AudioObject } from "./GameObject/FileTypes/Audio.js";
import { TextBox } from "./UIStrechableTab.js";
import { ScriptObject } from "./GameObject/FileTypes/ScriptObject.js";
import {
  addToUILayer,
  UIPopupPanel,
  ButtonWidget,
  roundRectangleGradientLook,
  textLook,
  TextboxWidget,
} from "./UIRendererLayer.js";
export let running = false;
export function setRunning(r) {
  //console.log("running set to " + r);
  running = r;
}

export let runningCooldown = 0;

export function cleanCode(code) {
  //Lets Remove the comments!
  let c = code;
  //let c = code;
  //c = c.replace(/(?:<NL>)/g, "\t\n");
  //c = c.replace(/(?:<TAB>)/g, "");

  return c;
}

export function getCode() {
  return document
    .getElementsByClassName("CodeMirror")[0]
    .CodeMirror.getDoc()
    .getValue("\n");
}

export function setCode(d) {
  return document
    .getElementsByClassName("CodeMirror")[0]
    .CodeMirror.getDoc()
    .setValue(d);
}
/*
export function compileCode(code) {
  console.log("Compiling...");
  let c = code;
  c = cleanCode(c);
  if (Date.now() - runningCooldown > 5000) {
    running = true;

    (async () => {
      var data = await readTextFile("scripts/GameLibs/gameToolbox.js");
      data = replaceAll(data, "export", "");

      try {
        eval(`${data}
        console.print = function (arg, col) {
          if(!col){consoleLog(arg);}
          else{addToConsole(arg, col)} 
        };
        ${c}
        try{
        onStart();
        }catch(err){
          if(!err.toString().includes("onStart is not defined")){
            console.error(err);
            addToConsole(
              "Error: "+err,
              "red"
            );
          }
        }
        function update_backend(){
          try{
            update();
          }catch(err){
            if(!err.toString().includes("update is not defined")){
              console.error(err);
              addToConsole(
                "Error: "+err,
                "red"
              );
            }
          }
          if(document.getElementById("stopVar").innerHTML == "true"){
            setRunning(false);
            clearInterval(update_Loop);        
          }
      } let update_Loop = setInterval(update_backend, Math.round(1000 / 60));`);
      } catch (error) {
        console.error(error);
        addToConsole(`Error: ${error}`, "red");
        setRunning(false);
      }
    })();
  }
}*/

let debugConsole = [];

export function consoleLog(Text) {
  debugConsole.push({ text: Text, col: "white" });
  if (debugConsole.length > 30) debugConsole.shift();
}
export function addToConsole(Text, Color) {
  debugConsole.push({ text: Text, col: Color });
  if (debugConsole.length > 30) debugConsole.shift();
}

export let consoleHeight = (height / 6) * 5 - 40;
let lastFrameY = -1;
let pinDrag = false;
setTextboxHeight(consoleHeight - 68);

let consoleArea = "Console";

let consoleMenu = new ButtonBar(10, 15, width, 40, "line");
consoleMenu.addButton("Console", function () {
  consoleArea = "Console";
});
consoleMenu.addButton("Assets", function () {
  consoleArea = "AssetManager";
});
let newScriptPopup = new PopupPanel(0, 0, 0, 0);
export function drawConsole() {
  //Console Main Background
  fill(primaryUIColor);
  rect(0, consoleHeight, width, height - consoleHeight);
  //Console Handle
  fill(handleUI);
  rect(0, consoleHeight, width, 40);
  consoleMenu.setY(Math.round(consoleHeight));
  consoleMenu.render();

  switch (consoleArea) {
    case "AssetManager":
      //fill("purple");
      //rect(width - 40, consoleHeight + 5, 30, 30);
      renderImage(uploadIcon, width - 40, consoleHeight + 5, 30, 30);

      renderImage(plusIcon, width - 75, consoleHeight + 5, 30, 30);
      if (
        mousePressed &&
        inArea(mouseX, mouseY, width - 75, consoleHeight + 5, 30, 30)
      ) {
        //newScriptPopup.setPos(width - 75, consoleHeight + 5);
        //newScriptPopup.setSize(100,100);

        addToUILayer(
          new UIPopupPanel(
            width / 2 - 150,
            height / 2 - 75,
            300,
            150,
            "Create Script"
          )
            .addComponent(
              new ButtonWidget(200, 50, (widgetHolder) => {
                //alert("Added Component");
                let val = widgetHolder.components[1].value;
                getDefaultStartFileCode((r) => {
                  let prompt = true;

                  if (!!assets.get(`${val.replace(".js", "")}.js`))
                    prompt = confirm(
                      "That file already exists, would you like to overwrite it?"
                    );
                  if (prompt) {
                    assets.set(
                      `${val.replace(".js", "")}.js`,
                      new ScriptObject(r)
                    );
                    widgetHolder.garbage = true;
                  }
                });
                //if (val != undefined)
              })
                .overidePosition("CENTERX", "BOTTOM")
                .addLooks(
                  new roundRectangleGradientLook(
                    secondaryUIColor,
                    primaryUIColor
                  )
                )
                .addLooks(new textLook("Create", textUIColor))
            )
            .addComponent(
              new TextboxWidget(250, 50)
                .overidePosition("CENTERX", "TOP")
                .addLooks(
                  new roundRectangleGradientLook(
                    secondaryUIColor,
                    primaryUIColor
                  )
                )
            )
        );
        /*let name = prompt("Name your script");

        //newScriptPopup.addComponent(new TextBox(10,10,80,20,"Name", ));
        if (name != null)
          getDefaultStartFileCode((r) => {
            assets.set(`${name}.js`, new ScriptObject(r));
          });*/
      } else if (
        mousePressed &&
        inArea(mouseX, mouseY, width - 40, consoleHeight + 5, 30, 30)
      ) {
        setMouseDown(false);
        pinDrag = false;
        (async (func) => {
          UploadFile((files) => {
            uploadFiles(files);
          });
        })();
      }
      //console.log(assets.size);
      let Assets = Array.from(assets.values());
      let AssetNames = Array.from(assets.keys());
      setFontSize(10, "Ubuntu");
      let imageX = 0;
      let imageY = 0;
      for (let i = 0; i < Assets.length; i++) {
        /*renderImage(
          Assets[i].getImage(),
          i * 60 + 20,
          consoleHeight + 80,
          50,
          50
        );*/
        let img = Assets[i].type == "Image" ? Assets[i].getImage() : fileIcon;
        if (Assets[i].type == "Audio") img = audioIcon;
        else if (Assets[i].type == "Script") img = scriptIcon;
        let ratio = calculateDecimalRatio(img.width, img.height);
        //console.log(ratio);
        let resizedW = ratio[0] * 100;
        let resizedH = ratio[1] * 100;
        renderImage(
          img,
          imageX * 110 + 20,
          consoleHeight + 80 + imageY * 140,
          resizedW,
          resizedH
        );

        if (
          mousePressed &&
          inArea(
            mouseX,
            mouseY,
            imageX * 110 + 20,
            consoleHeight + 80 + imageY * 140,
            resizedW,
            resizedH
          )
        ) {
          //if the mouse was clicked in a asset open a popup to show it.
          let newWin;
          if (Assets[i].type != "Script")
            newWin = window.open(
              "about:blank",
              "Preview",
              "width=400,height=400"
            );
          switch (Assets[i].type) {
            case "Image":
              newWin.document.write(`<image src="${Assets[i].data.src}">`);

              break;
            case "Audio":
              newWin.document.write(`<audio controls>
                 <source  src="${Assets[i].data.src}">
                </audio>
                `);

              break;
            case "Script":
              setState(states.scripting);
              document.getElementById("codeWrapper").style.display = "inline";
              setCode(Assets[i].data);
              setScriptOpen(AssetNames[i]);
              break;
            default:
              newWin.document.write(
                `<body type="text/plain">
                <pre style="word-wrap: break-word; white-space: pre-wrap;">${replaceAll(
                  replaceAll(Assets[i].data, "<", "&lt;"),
                  ">",
                  "&gt;"
                )}</pre>
                </body>`
              );

              break;
          }
        }
        text(
          AssetNames[i].substr(0, 20),
          centerText(AssetNames[i].substr(0, 20), imageX * 110 + 20, 100),
          consoleHeight + 80 + 110 + imageY * 140
        );
        imageX++;
        if ((imageX + 1) * 110 + 20 > width) {
          imageX = 0;
          imageY++;
        }
      }
      setFontSize(20, "Ubuntu");
      break;
    case "Console":
      try {
        let verticleOffset = 25;
        //Actually put the log messages
        for (let i = 0; i < debugConsole.length; i++) {
          fill(debugConsole[i].col);
          textWraped(
            debugConsole[i].text,
            40,
            consoleHeight +
              60 +
              verticleOffset * -i +
              verticleOffset * debugConsole.length,
            width,
            20
          );
        }
      } catch (err) {
        debugConsole = [];
        addToConsole(`Error Console Crash: ${err}`, "red");
      }
      break;

    default:
      break;
  }

  if (mouseDown) {
    if (inArea(mouseX, mouseY, 0, consoleHeight, width, 40) || pinDrag) {
      document.getElementById("GameViewer").height =
        height - (60 + (height - consoleHeight));
      pinDrag = true;
      if (consoleHeight - (lastFrameY - mouseY) > 100)
        consoleHeight = consoleHeight - (lastFrameY - mouseY);
      //testerGameWindow.canvas.height = consoleHeight - 60;
      setTextboxHeight(consoleHeight - 68);
    } else {
    }
  } else {
    pinDrag = false;
  }
  lastFrameY = mouseY;

  //testerGameWindow.canvas.width = width;
}

//!Add File Drop support below

let dropArea = document.getElementById("PopupUICanvasHolder");
//  .addEventListener("drop", dropHandler, false);

["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

dropArea.addEventListener("drop", dropHandler, false);

function dropHandler(e) {
  let dt = e.dataTransfer;
  let files = dt.files;
  uploadFiles(files);
}

function uploadFiles(files) {
  for (let i = 0; i < files.length; i++) {
    console.log(files[i].type);
    if (
      /*imageTypes.includes(files[i].type)*/ files[i].type.startsWith("image/")
    )
      readImage(files[i], (dataURL) => {
        assets.set(files[i].name, new ImageObject(dataURL));
      });
    else if (files[i].type.startsWith("audio/")) {
      readImage(files[i], (dataURL) => {
        assets.set(files[i].name, new AudioObject(dataURL));
      });
    } else if (files[i].type == "text/javascript") {
      readFile(files[i], (data) => {
        assets.set(files[i].name, new ScriptObject(data));
      });
    } else {
      readFile(files[i], (data) => {
        assets.set(files[i].name, new FileObject(data));
      });
    }
  }
}
