import {
  greyTextUIColor,
  handleUI,
  primaryUIColor,
  secondaryUIColor,
  textUIColor,
} from "../AssetManager.js";
import {
  addObject,
  objects,
  renderObjects,
  selectedOBJ,
  selectObject,
  setSelectedObj,
} from "../GameObject/ObjectHandler.js";
import { GameObject } from "../GameObject/GameObject.js";
import { RectangleObjectComponent } from "../GameObject/GameObjectComponents/GameComponents/RectangleComponent.js";

import {
  fill,
  height,
  inArea,
  mouseDown,
  mousePressed,
  mouseX,
  mouseY,
  rect,
  text,
  textWraped,
  width,
} from "../toolbox.js";
import { consoleHeight } from "../CodeCompiler.js";
import {
  NumberBox,
  TextBox,
  Toggle,
  UIStrechableTabLeft,
  UIStrechableTabRight,
} from "../UIStrechableTab.js";

export let explorerTab = new UIStrechableTabLeft(
  0,
  65,
  width / 5,
  consoleHeight - 65
);

let resetPropertiesTab = new UIStrechableTabRight(
  (width / 5) * 4,
  65,
  width / 5,
  consoleHeight - 65
);

export let propertiesTab;
resetPropertiesWindow();
let lastframeUnselected;
export function runUI() {
  if (selectedOBJ == null) {
    resetPropertiesWindow();
    lastframeUnselected = true;
  }

  if (selectedOBJ != null) {
    if (lastframeUnselected) {
      //Copy all the data accross

      //TODO look through all of the components in a lookup table using TypeOf to see what components are needed to be put down
      propertiesTab.addComponent(
        new TextBox(
          30,
          5,
          100,
          50,
          objects[selectedOBJ].name,
          objects[selectedOBJ],
          "setName"
        )
      );
      propertiesTab.addComponent(
        new Toggle(
          30,
          60,
          50,
          50,
          objects[selectedOBJ].enabled,
          objects[selectedOBJ],
          "setEnabled"
        )
      );
      propertiesTab.addComponent(
        new NumberBox(
          30,
          120,
          50,
          50,
          objects[selectedOBJ].x,
          objects[selectedOBJ],
          "setX"
        )
      );
      propertiesTab.addComponent(
        new NumberBox(
          30 + 60,
          120,
          50,
          50,
          objects[selectedOBJ].y,
          objects[selectedOBJ],
          "setY"
        )
      );
    }
    lastframeUnselected = false;
  }

  createNewObjectButton();

  resizeCanvas();
  renderObjects();
  selectObject();

  explorerTab.runBar();
  explorerTab.updateSizes(65, consoleHeight - 65);

  for (let i = 0; i < objects.length; i++) {
    const obj = objects[i];
    //Highlight the selected object in the explorer
    fill(secondaryUIColor);
    if (selectedOBJ == i) rect(0, 100 + (i - 0.9) * 30, explorerTab.w, 30);
    fill(textUIColor);
    if (!obj.enabled) fill(greyTextUIColor);
    textWraped(obj.name, 30, 100 + i * 30, explorerTab.w - 30, height - 80);
  }
}

export function showPropertiesBar(object) {
  //Temparary way of adding button
  if (selectedOBJ != null) {
    if (propertiesTab.components.length == 0) {
      propertiesTab.addComponent(
        new Toggle(30, 60, 50, 50, true, objects[selectedOBJ], "setEnabled")
      );
      propertiesTab.addComponent(
        new TextBox(
          30,
          5,
          100,
          50,
          objects[selectedOBJ].name,
          objects[selectedOBJ],
          "setName"
        )
      );
      propertiesTab.addComponent(
        new NumberBox(
          30,
          120,
          50,
          50,
          objects[selectedOBJ].x,
          objects[selectedOBJ],
          "setX"
        )
      );
      propertiesTab.addComponent(
        new NumberBox(
          30 + 60,
          120,
          50,
          50,
          objects[selectedOBJ].y,
          objects[selectedOBJ],
          "setY"
        )
      );

      propertiesTab.addComponent(
        new NumberBox(
          90 + 60,
          120,
          50,
          50,
          objects[selectedOBJ].w,
          objects[selectedOBJ],
          "setWidth"
        )
      );
      propertiesTab.addComponent(
        new NumberBox(
          150 + 60,
          120,
          50,
          50,
          objects[selectedOBJ].h,
          objects[selectedOBJ],
          "setHeight"
        )
      );
    }
  }

  propertiesTab.updateSizes(65, consoleHeight - 65);
  propertiesTab.runBar();
}

export function resetPropertiesWindow() {
  propertiesTab = $.extend(
    true,
    Object.create(Object.getPrototypeOf(resetPropertiesTab)),
    resetPropertiesTab
  );
  //deleteItemByID("xposition");
}

export function setLastframeUnselected(f) {
  lastframeUnselected = f;
}

function resizeCanvas() {
  //Check to see if the canvas needs to be resized to fill all the space
  if (
    document.getElementById("GameViewer").style.left !=
      explorerTab.w + 20 + "px" ||
    document.getElementById("GameViewer").width !=
      Math.round(
        width -
          (explorerTab.w + 20) -
          (selectedOBJ != null ? width - propertiesTab.x : 0)
      )
  ) {
    document.getElementById("GameViewer").style.left =
      explorerTab.w + 20 + "px";

    document.getElementById("GameViewer").width =
      width -
      (explorerTab.w + 20) -
      (selectedOBJ != null ? width - propertiesTab.x : 0);
  }
}

function createNewObjectButton() {
  fill(primaryUIColor);
  rect(width - 60, 10, 50, 50);
  fill(textUIColor);
  rect(width - 60 + 21, 10 + 5, 50 - 42, 50 - 10);
  rect(width - 60 + 5, 10 + 21, 50 - 10, 50 - 42);
  if (mousePressed && inArea(mouseX, mouseY, width - 60, 10, 50, 50)) {
    addObject(
      new GameObject(10, 10, 200, 200)
        .addComponent(new RectangleObjectComponent("blue"))
        .setName("Object")
    );
    resetPropertiesWindow();
    setSelectedObj(objects.length - 1);
  }
}

export function createNumberBox(x, y, w, h, id) {
  let textBox = document.createElement("input");
  textBox.type = "number";
  textBox.style.position = "absolute";
  textBox.id = id;
  textBox.style.left = x + "px";
  textBox.style.top = y + "px";
  textBox.style.width = w;
  textBox.style.height = h;
  document.getElementById("GameObjectsHolder").append(textBox);
}

export function deleteItemByID(id) {
  let obj = document.getElementById(id);
  obj.remove();
}
