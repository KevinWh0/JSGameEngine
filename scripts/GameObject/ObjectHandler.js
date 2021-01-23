import {
  greyTextUIColor,
  secondaryUIColor,
  textUIColor,
} from "../AssetManager.js";
import {
  explorerTab,
  resetPropertiesWindow,
  setLastframeUnselected,
  showPropertiesBar,
} from "../GameEditorTools/GameEditorUI.js";
import {
  fillGameCanvas,
  rectGameCanvas,
} from "../GameLibs/gameCanvasRendering.js";
import { getOffset } from "../GameLibs/gameToolbox.js";
import {
  fill,
  height,
  inArea,
  mousePressed,
  mouseX,
  mouseY,
  rect,
  textWraped,
} from "../toolbox.js";
import { GameObject } from "./GameObject.js";
import { RectangleObjectComponent } from "./GameObjectComponents/GameComponents/RectangleComponent.js";
import { ScriptComponent } from "./GameObjectComponents/GameComponents/ScriptComponent.js";
import { TexturedObjectComponent } from "./GameObjectComponents/GameComponents/TextureComponent.js";
import { selectedOBJ, setSelectedObj } from "./selectedOBJHandler.js";
export let objects = [];
export function setObjects(objArr) {
  objects = objArr;
}
addObject(new GameObject(10, 10, 0, 0).setName("Camera").setType("Camera"));

export function selectObject() {
  getOffset();
  let pressedInRectThisFrame = false;

  for (let i = 0; i < objects.length; i++) {
    const obj = objects[i];
    if (
      mousePressed &&
      inArea(
        mouseX,
        mouseY,
        parseInt(obj.x) + getOffset().x,
        parseInt(obj.y) + getOffset().y,
        parseInt(obj.w),
        parseInt(obj.h)
      ) &&
      obj.enabled
    ) {
      pressedInRectThisFrame = true;
      setSelectedObj(i);
      resetPropertiesWindow();
    }
  }
  if (!pressedInRectThisFrame && mousePressed) {
    if (
      inArea(
        mouseX,
        mouseY,
        parseInt(
          document.getElementById("GameViewer").style.left.replace("px", "")
        ),
        parseInt(
          document.getElementById("GameViewer").style.top.replace("px", "")
        ),
        parseInt(document.getElementById("GameViewer").width),
        parseInt(document.getElementById("GameViewer").height)
      )
    )
      setSelectedObj(null);
  }
  if (selectedOBJ != null) {
    const selOBJ = objects[selectedOBJ];
    //Render a rectangle over the object to show its selected
    fillGameCanvas("rgba(255,0,0,0.4)");
    rectGameCanvas(
      parseInt(selOBJ.x),
      parseInt(selOBJ.y),
      parseInt(selOBJ.w),
      parseInt(selOBJ.h)
    );

    showPropertiesBar(selOBJ);
  }

  //Rendering for the sidebar is done in GameEditorUI around ln 101
  for (let i = 0; i < objects.length; i++) {
    const obj = objects[i];
    if (
      mousePressed &&
      inArea(mouseX, mouseY, 0, 100 + (i - 0.9) * 30, explorerTab.w, 30)
    ) {
      //Reset the properties panel
      resetPropertiesWindow();
      setLastframeUnselected(true);
      //Set the selection ID to the correct ID
      setSelectedObj(i);
    }
  }
}

export function renderObjects() {
  for (let i = 0; i < objects.length; i++) {
    const obj = objects[i];
    obj.update();
  }
}

export function addObject(obj) {
  objects.push(obj);
}
//All the components in a map
export let componentsMap = new Map();
let obj = new RectangleObjectComponent("blue");
componentsMap.set(obj.componentName, obj);
obj = new TexturedObjectComponent();
componentsMap.set(obj.componentName, obj);
obj = new ScriptComponent();
componentsMap.set(obj.componentName, obj);
