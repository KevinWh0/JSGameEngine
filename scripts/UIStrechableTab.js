import { handleUI, primaryUIColor, secondaryUIColor } from "./AssetManager.js";
import {
  fill,
  inArea,
  keyPressed,
  keyPushed,
  mouseDown,
  mousePressed,
  mouseX,
  mouseY,
  rect,
  text,
  width,
} from "./toolbox.js";
import { selectedOBJ } from "./GameObject/ObjectHandler.js";

export class UIStrechableTabRight {
  x;
  y;
  w;
  h;
  initallyPressedIn = false;
  components = [];
  constructor(x, y, w, h) {
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
  }

  runBar() {
    fill(primaryUIColor);
    rect(this.x, this.y, width, this.h);
    fill(handleUI);
    rect(this.x, this.y, 20, this.h);
    if (mouseDown && inArea(mouseX, mouseY, this.x, this.y, 20, this.h)) {
      this.initallyPressedIn = true;
    }

    if (this.initallyPressedIn) {
      this.x = mouseX;
    }

    if (!mouseDown) {
      this.initallyPressedIn = false;
    }
    /* Run the components */
    this.components.forEach((comp) => {
      comp.run(this, 0);
    });
  }
  updateSizes(y, h) {
    //this.w = w;
    this.h = h;
    //this.x = x;
    this.y = y;
  }

  addComponent(component) {
    this.components.push(component);
  }
}

export class UIStrechableTabLeft {
  x;
  y;
  w;
  h;
  initallyPressedIn = false;
  components = [];
  constructor(x, y, w, h) {
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
  }

  runBar() {
    fill(primaryUIColor);
    rect(this.x, this.y, this.w, this.h);
    fill(handleUI);
    rect(this.x + this.w, this.y, 20, this.h);

    if (
      mouseDown &&
      inArea(mouseX, mouseY, this.x + this.w, this.y, 20, this.h)
    ) {
      this.initallyPressedIn = true;
    }

    if (this.initallyPressedIn) {
      this.w = mouseX;
      this.x = mouseX - this.w;
    }

    /* Run the components */
    this.components.forEach((comp) => {
      comp.run(this, 0);
    });
    if (!mouseDown) {
      this.initallyPressedIn = false;
    }
  }
  updateSizes(y, h) {
    //this.w = w;
    this.h = h;
    //this.x = x;
    this.y = y;
  }

  addComponent(component) {
    this.components.push(component);
  }
  getClone() {
    //return ;
  }
}

export class ObjectWrapper {
  components = [];
  constructor() {}

  run(tab, yOffset) {}

  addComponent(component) {
    this.components.push(component);
  }
}

export class Toggle {
  x;
  y;
  w;
  h;
  enabled = true;
  color = {
    true: "white",
    false: secondaryUIColor,
  };
  //This is the function that will be called to set a var
  setterFunction;
  setterBase;
  classInstance;
  constructor(x, y, w, h, startingOn, classInstance, setterFunction) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.setterFunction = setterFunction;
    this.enabled = startingOn;
    this.classInstance = classInstance;
  }
  //The yOffset will be used for scrolling
  run(tab, yOffset) {
    //console.log(this.enabled);
    fill(this.color[this.enabled]);
    rect(this.x + tab.x, this.y + tab.y + yOffset, this.w, this.h);
    if (
      mousePressed &&
      inArea(
        mouseX,
        mouseY,
        this.x + tab.x,
        this.y + tab.y + yOffset,
        this.w,
        this.h
      )
    ) {
      this.enabled = !this.enabled;
      eval(`this.classInstance.${this.setterFunction}(${this.enabled})`);
      //this.setterFunction(this.enabled);
    }
  }
}

export class TextBox {
  x;
  y;
  w;
  h;
  selected = false;
  text = "";
  color = {
    background: "white",
    false: secondaryUIColor,
  };
  //This is the function that will be called to set a var
  setterFunction;
  //setterBase;
  //This is the passed in instance of the class.
  classInstance;
  constructor(x, y, w, h, startingText, classInstance, setterFunction) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.setterFunction = setterFunction;
    this.text = startingText;
    this.classInstance = classInstance;
  }
  //The yOffset will be used for scrolling
  run(tab, yOffset) {
    //console.log(this.enabled);
    fill(this.color["background"]);
    rect(this.x + tab.x, this.y + tab.y + yOffset, this.w, this.h);
    fill("black");
    text(this.text, this.x + tab.x, this.y + tab.y + yOffset + 40);
    if (
      inArea(
        mouseX,
        mouseY,
        this.x + tab.x,
        this.y + tab.y + yOffset,
        this.w,
        this.h
      )
    ) {
      if (mousePressed) this.selected = true;
      //this.setterFunction(this.enabled);
    } else {
      if (mousePressed) this.selected = false;
    }
    if (this.selected) {
      if (keyPressed != -1 && keyPushed) {
        //console.log(keyPressed, keyPushed);
        if (keyPressed.toString() == "Backspace") {
          this.text = this.text.substr(0, this.text.length - 1);
        } else if (keyPressed.toString() != "Alt")
          this.text = this.text + keyPressed;

        eval(`this.classInstance.${this.setterFunction}("${this.text}")`);
      }
    } else {
      if (this.text == "") {
        this.text = "Object";
        eval(`this.classInstance.${this.setterFunction}("${this.text}")`);
      }
    }
  }
}
