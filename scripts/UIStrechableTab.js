import {
  handleUI,
  primaryUIColor,
  secondaryUIColor,
  textUIColor,
} from "./AssetManager.js";
import {
  fill,
  inArea,
  keyPressed,
  keyPushed,
  keys,
  mouseDown,
  mousePressed,
  mouseX,
  mouseY,
  rect,
  text,
  width,
} from "./toolbox.js";
import { selectedOBJ } from "./GameObject/selectedOBJHandler.js";

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
    background: handleUI,
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
    fill(textUIColor);
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
        let key = keyPressed.toString();
        if (keys[16]) key = key.toUpperCase();
        if (keyPressed.toString() == "Backspace") {
          this.text = this.text.substr(0, this.text.length - 1);
        } else if (keyPressed.toString() != "Alt" && key != "SHIFT")
          this.text = this.text + key;

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

export class NumberBox {
  x;
  y;
  w;
  h;
  selected = false;
  number = 0;
  color = {
    background: handleUI,
    false: secondaryUIColor,
  };
  //This is the function that will be called to set a var
  setterFunction;
  //setterBase;
  //This is the passed in instance of the class.
  classInstance;
  constructor(x, y, w, h, startingNumber, classInstance, setterFunction) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.setterFunction = setterFunction;
    this.number = startingNumber;
    this.classInstance = classInstance;
  }
  //The yOffset will be used for scrolling
  run(tab, yOffset) {
    //console.log(this.enabled);
    fill(this.color["background"]);
    rect(this.x + tab.x, this.y + tab.y + yOffset, this.w, this.h);
    fill(textUIColor);
    text(this.number, this.x + tab.x, this.y + tab.y + yOffset + 40);
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
        let key = keyPressed.toString();
        if (keyPressed.toString() == "Backspace") {
          this.number = this.number
            .toString()
            .substr(0, this.number.toString().length - 1);
        } else this.number = this.number.toString() + key;

        if (this.number != NaN)
          eval(
            `this.classInstance.${this.setterFunction}("${parseFloat(
              this.number
            )}")`
          );
      }
    } else {
      if (this.number.toString().toLowerCase() == "nan") {
        this.number = 0;
        eval(`this.classInstance.${this.setterFunction}("${this.number}")`);
      }
    }
  }
}

export class TextArea {
  x;
  y;
  w;
  h;
  selected = false;
  number = 0;
  color = {
    background: "white",
    false: secondaryUIColor,
  };
  text;
  constructor(text, x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.text = text;
  }
  //The yOffset will be used for scrolling
  run(tab, yOffset) {
    //console.log(this.enabled);
    fill(this.color["background"]);
    text(this.text, this.x + tab.x, this.y + tab.y + yOffset, this.w, this.h);
  }
}

export class CustomFunction {
  func;
  constructor(func) {
    this.func = func;
  }
  //The yOffset will be used for scrolling
  run(tab, yOffset) {
    //console.log(this.enabled);
    this.func(tab, yOffset);
  }
}
