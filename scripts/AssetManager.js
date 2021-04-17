import { consoleHeight, setCode } from "./Console.js";
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
import { DropdownWidget, roundRectangleLook } from "./UIRendererLayer.js";
import { TextBox } from "./UIStrechableTab.js";

/*state Manager*/
export const states = {
  scripting: "scripting",
  gameViewer: "gameViewer",
};
document.getElementById("codeWrapper").style.display = "none";

export let state = states.gameViewer;
export function setState(s) {
  state = s;
}

/* UI Color Scheme */
export const primaryUIColor = "rgb(59, 59, 59)";
export const secondaryUIColor = "rgb(24, 24, 24)";
export const handleUI = "rgb(51, 51, 51)";
export const textUIColor = "rgb(255,255,255)";
export const greyTextUIColor = "rgb(150,150,150)";
export const hightlightsColor = "rgb(39, 232, 167)";

export const mainFont = "Ubuntu";

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
  OnSelect: (parent, objects) => {
    //The parent is the popup pannel
    parent.removeAllComponents();

    var dropdown = new DropdownWidget(200, 50)
      .overidePosition("CENTERX", "TOP")
      .addLooks(new roundRectangleLook(secondaryUIColor))
      .setOptions(
        Array.from(assets.keys()).filter(
          (asset) => assets.get(asset).type == "Image"
        )
      )
      .setOnselect((selected) => {
        objects[selectedOBJ].components[
          selectedComponent
        ].data.image = selected;
      });

    var currentImage =
      objects[selectedOBJ].components[selectedComponent].data.image;
    if (currentImage != undefined) {
      dropdown.setSelected(currentImage);
    }

    parent.addComponent(dropdown);

    return parent;
  },
});

componentsUIDictionary.set("Rectangle Component", {
  OnSelect: (parent, objects) => {
    //The parent is the popup pannel
    parent.removeAllComponents();

    var dropdown = new DropdownWidget(200, 50)
      .overidePosition("CENTERX", "TOP")
      .addLooks(new roundRectangleLook(secondaryUIColor))
      .setOptions([
        "red",
        "orange",
        "yellow",
        "green",
        "blue",
        "purple",
        "white",
        "black",
        "grey",
      ])
      .setOnselect((selected) => {
        objects[selectedOBJ].components[
          selectedComponent
        ].data.color = selected;
      });

    var currentCol =
      objects[selectedOBJ].components[selectedComponent].data.color;
    if (currentCol != undefined) {
      dropdown.setSelected(currentCol);
    }

    parent.addComponent(dropdown);
    //setSelected

    return parent;
  },
});

componentsUIDictionary.set("Text Component", {
  OnSelect: (parent, objects) => {
    //The parent is the popup pannel
    parent.removeAllComponents();
    try {
      parent
        .addComponent(
          new Dropdown(10, 50, 100, 40, "text").setOnExpand((parent1) => {
            parent1.clearItems();
            parent1.addItem("red");
            parent1.addItem("orange");
            parent1.addItem("yellow");
            parent1.addItem("green");
            parent1.addItem("blue");
            parent1.addItem("purple");
            parent1.addItem("black");
            parent1.addItem("white");
          })
        )
        .addComponent(
          new Dropdown(10, 100, 100, 40, "font").setOnExpand((parent1) => {
            parent1.clearItems();

            Array.from(assets.keys()).forEach((a) => {
              if (assets.get(a).type == "Font") parent1.addItem(a);
            });
          })
        );
    } catch (error) {
      console.log(error);
    }
  },
});

componentsUIDictionary.set("Script Component", {
  OnSelect: (parent, objects) => {
    //The parent is the popup pannel
    parent.removeAllComponents();

    var dropdown = new DropdownWidget(200, 50)
      .overidePosition("CENTERX", "TOP")
      .addLooks(new roundRectangleLook(secondaryUIColor))
      .setOptions(
        Array.from(assets.keys()).filter(
          (asset) => assets.get(asset).type == "Script"
        )
      )
      .setOnselect((selected) => {
        objects[selectedOBJ].components[
          selectedComponent
        ].data.script = selected;
      });

    var currentScript =
      objects[selectedOBJ].components[selectedComponent].data.script;
    if (currentScript != undefined) {
      dropdown.setSelected(currentScript);
    }

    parent.addComponent(dropdown);

    return parent;
  },
});

//Note: To add a components you must do it here and then add it to the game toolbox and also the object
//Handler.

/* Script Data */
//When a script is made use the name as the key and the code as the item.
let scripts = new Map();
export let scriptOpen = null;
export function setScriptOpen(Name) {
  scriptOpen = Name;
}
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
export function getDefaultStartFileCode(callback) {
  (async () => {
    var data = await readTextFile(startFilePath);
    fileData = data;
    scripts.set(scriptOpen, data);
    callback(fileData);
  })();
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

export let uploadIcon = new Image();
uploadIcon.src = "./EngineAssets/Upload.svg";

export let fileIcon = new Image();
fileIcon.src =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAVklEQVQ4T2NkoBAwoun/T8A8dPUMyAL/" +
  "/" +
  "/" +
  "/Hr5+REawcxRAMA6CKMBwCMxzdEJJcADMV2RCiXQDTDHIJXgOIiZRRFzDgD0Rc6WCExALIm4RyIzw1wxgAHlRIEZs+XvUAAAAASUVORK5CYII=";

export let audioIcon = new Image();
audioIcon.src = "./EngineAssets/AudioIcon.png";
export let scriptIcon = new Image();
scriptIcon.src = "./EngineAssets/ScriptIcon.png";
export let plusIcon = new Image();
plusIcon.src = "./EngineAssets/PlusIcon.png";
