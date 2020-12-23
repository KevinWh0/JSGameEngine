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
} from "./AssetManager.js";
import {
  addNSecondsDelay,
  fill,
  getTextWidth,
  height,
  inArea,
  mouseDown,
  mouseX,
  mouseY,
  readTextFile,
  rect,
  replaceAll,
  text,
  textWraped,
  width,
} from "./toolbox.js";

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
}

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

export function drawConsole() {
  fill(primaryUIColor);
  rect(0, consoleHeight, width, height - consoleHeight);
  fill(handleUI);
  rect(0, consoleHeight, width, 40);
  //testerGameWindow.canvas.width = width;
  if (mouseDown) {
    if (inArea(mouseX, mouseY, 0, consoleHeight, width, 40) || pinDrag) {
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
}
