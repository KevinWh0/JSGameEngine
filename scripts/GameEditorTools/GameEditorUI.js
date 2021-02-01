import {
  componentsUIDictionary,
  greyTextUIColor,
  handleUI,
  primaryUIColor,
  secondaryUIColor,
  textUIColor,
} from "../AssetManager.js";
import {
  addObject,
  componentsMap,
  renderObjects,
  selectObject,
  objects,
} from "../GameObject/ObjectHandler.js";
import {
  selectedOBJ,
  setSelectedObj,
} from "../GameObject/selectedOBJHandler.js";
import { GameObject } from "../GameObject/GameObject.js";
import { RectangleObjectComponent } from "../GameObject/GameObjectComponents/GameComponents/RectangleComponent.js";

import {
  button,
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
  getFontSize,
  PopupPanel,
  Dropdown,
  returnCopy,
  getTextWidth,
  findTextFitSize,
  setFontSize,
} from "../toolbox.js";
import { consoleHeight } from "../Console.js";
import {
  NumberBox,
  TextBox,
  Toggle,
  TextArea,
  UIStrechableTabLeft,
  UIStrechableTabRight,
  CustomFunction,
} from "../UIStrechableTab.js";
import { TexturedObjectComponent } from "../GameObject/GameObjectComponents/GameComponents/TextureComponent.js";
import {
  assets,
  selectedComponent,
  setSelectedComponent,
} from "../GameAssets/AssetHandler.js";

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

export let componentEditorPopup = new PopupPanel(10, 10, 10, 10);

export let addComponentPopup = new PopupPanel(10, 10, 10, 10);

/*.addComponent(
  new Dropdown(10, 50, 100, 40).setOnExpand((parent) => {
    parent.clearItems();
    Array.from(assets.keys()).forEach((a) => {
      if (assets.get(a).type == "Image") parent.addItem(a);
    });
  })
)*/

function addBaseComponents() {
  propertiesTab.addComponent(
    new TextBox(
      30,
      5,
      200,
      50,
      objects[selectedOBJ].name,
      objects[selectedOBJ],
      "setName"
    )
  );
  propertiesTab.addComponent(
    /*new Toggle(
      30,
      60,
      50,
      50,
      objects[selectedOBJ].enabled,
      objects[selectedOBJ],
      "setEnabled"
    )*/
    new Toggle(
      235,
      5,
      20,
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
  propertiesTab.addComponent(new TextArea("Components:", 30, 220, 50, 50));
  propertiesTab.addComponent(
    new CustomFunction((tab, yOffset) => {
      if (selectedComponent != null) {
        fill(secondaryUIColor);
        rect(
          20 + tab.x,
          250 + tab.y + yOffset + (selectedComponent - 1) * 20,
          width,
          getFontSize() + 5
        );
      }
      for (let i = 0; i < objects[selectedOBJ].components.length; i++) {
        fill(textUIColor);

        text(
          objects[selectedOBJ].components[i].componentName,
          30 + tab.x,
          250 + tab.y + yOffset + i * 20
        );
        if (!componentEditorPopup.showing)
          if (
            mousePressed &&
            inArea(
              mouseX,
              mouseY,
              30 + tab.x,
              250 + tab.y + yOffset + (i - 1) * 20,
              width,
              getFontSize()
            )
          ) {
            //setup the popup panel with required components
            //Runs once when first clicked.
            componentEditorPopup.components = [];
            try {
              componentEditorPopup.runAsPanel(
                componentsUIDictionary.get(
                  objects[selectedOBJ].components[i].componentName
                ).OnSelect,
                objects
              );
            } catch (error) {}
            componentEditorPopup.setPos(tab.x + 25, tab.y + tab.h - 200);
            componentEditorPopup.setSize(tab.w - 30, 200);
            componentEditorPopup.setShowing();
            setSelectedComponent(i);
          }
      }
      //console.log(componentEditorPopup.components);
      if (!componentEditorPopup.showing && !addComponentPopup.showing)
        button(
          "Add Component",
          30 + tab.x,
          250 + tab.y + yOffset + objects[selectedOBJ].components.length * 20,
          200,
          50,
          30,
          () => {
            addComponentPopup.removeAllComponents();
            addComponentPopup.setShowing(true);
            addComponentPopup.setPos(tab.x + 25, tab.y + tab.h - 200);
            componentEditorPopup.setSize(tab.w - 30, 200);

            let dropdown = new Dropdown(10, 150, 100, 40);
            for (let i = 0; i < Array.from(componentsMap.keys()).length; i++) {
              dropdown.addItem(Array.from(componentsMap.keys())[i]);
            }
            dropdown.setText("Select Component");
            addComponentPopup.addComponent(dropdown);

            /*
                addObject(
      new GameObject(10, 10, 200, 200)
        .addComponent(new RectangleObjectComponent("blue"))
        //.addComponent(new TexturedObjectComponent())
        .setName("Object")
    );
     */
            /*
            if (
              !objects[selectedOBJ].components.includes(
                componentsMap.get("Textured Component")
              )
            )*/
            //objects[selectedOBJ].addComponent(
            //returnCopy(componentsMap.get("Textured Component"))
            //);
          }
        );
      if (addComponentPopup.showing) {
        if (
          addComponentPopup.components[0].currentSelection != "Select Component"
        ) {
          objects[selectedOBJ].addComponent(
            returnCopy(
              componentsMap.get(
                addComponentPopup.components[0].currentSelection
              )
            )
          );
          addComponentPopup.removeAllComponents();
          addComponentPopup.setShowing(false);
        }
        addComponentPopup.run();
      }
      if (selectedComponent != null) {
        componentEditorPopup.run();
      }
      //setup the popup panel with required components
      try {
        componentEditorPopup.runAsPanel(
          componentsUIDictionary.get(
            objects[selectedOBJ].components[selectedComponent].componentName
          ).Update,
          objects
        );
      } catch (error) {}
      //rect(30 + tab.x, 250 + tab.y + yOffset + objects[selectedOBJ].components.length * 20, 100,50);
    })
  );
}
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
      addBaseComponents();
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
    //setFontSize(findTextFitSize(obj.name, explorerTab.w - 30), "Ubuntu");

    textWraped(obj.name, 30, 100 + i * 30, explorerTab.w - 30, height - 80);
  }
}

export function showPropertiesBar(object) {
  //Temparary way of adding button
  if (selectedOBJ != null) {
    if (propertiesTab.components.length == 0) {
      addBaseComponents();
    }
  }

  propertiesTab.updateSizes(65, consoleHeight - 65);
  propertiesTab.runBar();
}

export function resetPropertiesWindow() {
  //Hide that popup that shows for selected things
  setSelectedComponent(null);
  componentEditorPopup.removeAllComponents();
  componentEditorPopup.setShowing(false);
  //Reset the properties tab
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
        //.addComponent(new RectangleObjectComponent("blue"))
        //.addComponent(new TexturedObjectComponent())
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
