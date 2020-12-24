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

export let objects = [];
addObject(new GameObject(10, 10, 200, 200).setName("Camera").setType("Camera"));
export let assets = new Map();
export let selectedOBJ = null;
export function setSelectedObj(o) {
  selectedOBJ = o;
}
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
        obj.x + getOffset().x,
        obj.y + getOffset().y,
        obj.w,
        obj.h
      ) &&
      obj.enabled
    ) {
      pressedInRectThisFrame = true;
      selectedOBJ = i;
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
      selectedOBJ = null;
  }
  if (selectedOBJ != null) {
    const selOBJ = objects[selectedOBJ];
    //Render a rectangle over the object to show its selected
    fillGameCanvas("rgba(255,0,0,0.4)");
    rectGameCanvas(selOBJ.x, selOBJ.y, selOBJ.w, selOBJ.h);

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
