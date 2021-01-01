import { compileCode, consoleHeight, setCode } from "./CodeCompiler.js";
import { assets, selectedComponent } from "./GameAssets/AssetHandler.js";
import { selectedOBJ } from "./GameObject/selectedOBJHandler.js";
import {
  background,
  fill,
  keyDown,
  keyHeldText,
  keyPressed,
  keyReleased,
  releasedKey,
  setFontSize,
  width,
  rect,
  game,
  keys,
  copyToClipboard,
  getDataOnClipboard,
  getTextOnClipboard,
  text,
  height,
  readTextFile,
  Dropdown,
} from "./toolbox.js";

/*state Manager*/
export const states = {
  scripting: "scripting",
  gameViewer: "gameViewer",
};

export let state = states.scripting;
export function setState(s) {
  state = s;
}

/* UI Color Scheme */
export const primaryUIColor = "rgb(59, 59, 59)";
export const secondaryUIColor = "rgb(24, 24, 24)";
export const handleUI = "rgb(51, 51, 51)";
export const textUIColor = "white";
export const greyTextUIColor = "rgb(150,150,150)";

export let specialChars = {
  return: "⏎",
  tab: "↹",
};
export let componentsUIDictionary = new Map();

/*
componentsUIDictionary.set("Rectangle Component", {
  OnSelect: (parent) => {
    //The parent is the popup pannel
    parent.removeAllComponents();
    //TODO add color selector here
  },
  Update: (parent) => {
    //This is used for the actual setting of the values
    objects[selectedOBJ].components[selectedComponent].data.color =
      parent.components[0].currentCol;
  },
});
*/
componentsUIDictionary.set("Textured Component", {
  OnSelect: (parent) => {
    //The parent is the popup pannel
    parent.removeAllComponents();

    parent.addComponent(
      new Dropdown(10, 50, 100, 40).setOnExpand((parent1) => {
        parent1.clearItems();
        Array.from(assets.keys()).forEach((a) => {
          if (assets.get(a).type == "Image") parent1.addItem(a);
        });
      })
    );
  },
  Update: (parent) => {
    console.log(objects[selectedOBJ].components[selectedComponent]);
    //This is used for the actual setting of the values
    if (parent.components[0].currentSelection == "No Image")
      objects[selectedOBJ].components[selectedComponent] = null;
    else {
      objects[selectedOBJ].components[selectedComponent] =
        parent.components[0].currentSelection;
    }
  },
});

/* Script Data */
//When a script is made use the name as the key and the code as the item.
let scripts = new Map();
export let scriptOpen = "Main";

let selection = { start: 0, end: 1 };

export let fileData;

let startFilePath = "scripts/ScriptPresets/StarterFile.txt";

export let testerGameWindow = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.position = "absolute";
    this.canvas.style = "left: 0px; top: 60px;";
    //this.canvas.style.top = 60;

    this.canvas.id = "GameViewer";
    this.context = this.canvas.getContext("2d");
    document.getElementById("GameObjectsHolder").appendChild(this.canvas);
  },
  clear: function () {
    //this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};
testerGameWindow.start();
testerGameWindow.canvas.width = width;
testerGameWindow.canvas.height = consoleHeight - 60;

/* Game Tester Canvas */

/* State Code */
export let stateCode = new Map();

export function setTextboxHeight(h) {
  document.getElementById("codeWrapper").style.height = h + "px";
  document.getElementById("forumCodeWrapper").style.height = h + "px";
  document.getElementsByClassName("CodeMirror")[0].style.height = h + "px";
}

export function setTextboxY(h) {
  document.getElementById("codeWrapper").style.top = h + "px";
  document.getElementById("forumCodeWrapper").style.top = h + "px";
  document.getElementsByClassName("CodeMirror")[0].style.top = h + "px";
}

stateCode.set("scripting", function (tick) {
  //background(primaryUIColor);

  setTextboxY(50);
  fill(secondaryUIColor);
  rect(0, 60, width, height);
  if (!scripts.get(scriptOpen)) {
    scripts.set(scriptOpen, "");

    (async () => {
      var data = await readTextFile(startFilePath);
      fileData = data;
      scripts.set(scriptOpen, data);
      setCode(fileData);
    })();

    console.log(`Created Script ${scriptOpen}`);
  }

  /*
  try {
    setFontSize(20, "Source Code Pro");
    fileData = scripts.get(scriptOpen);
    //scripts.set(scriptOpen, fileData);
  } catch (err) {
    //most likley cause is that the script does not exist so lets create it
  }*/
});

stateCode.set("gameViewer", function (tick) {
  //run the games update loops
  //scripts
  //fill("white");
  //rect(0, 60, width, consoleHeight - 60);
});

export let jsIcon = new Image();
jsIcon.src = "./EngineAssets/js_purpleGradientOutline.svg";

export let noTextureSelected = new Image();
noTextureSelected.src = "./EngineAssets/NoTexture.svg";
