import {
  fill,
  getContext,
  height,
  inArea,
  mousePressed,
  mouseX,
  mouseY,
  rect,
  setContext,
  text,
  width,
} from "./toolbox.js";

export let UILayer = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.id = "UI_Layer";
    this.context = this.canvas.getContext("2d");
    document.getElementById("PopupUICanvasHolder").appendChild(this.canvas);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};

let UI = [];

export function runUILayer() {}

export function addToUILayer(u) {
  UI.push(u);
}

export class UIPopupPanel {
  x;
  y;
  w;
  h;
  scrollY;
  components = [];
  //If the components leave the bounds of the box it counts as overflowing
  overflowing = false;
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.scrollY = 0;
  }

  run() {
    let c = getContext();
    setContext(UILayer.context);
    let xPos = 10;
    let yPos = 10 - this.scrollY;
    for (let i = 0; i < this.components.length; i++) {
      this.components[i].run(
        this.x + this.scrollY + xPos,
        this.y + this.scrollY + yPos,
        this.w,
        this.h,
        this
      );
      xPos += this.components[i].w + 20;
      if (xPos + this.components[i].w > this.w) {
        xPos = 10;
        yPos += this.components[i].h + 20;
      }
      if (yPos + this.components[i].h > this.h) {
        this.overflowing = true;
        return;
      }
    }
    if (
      this.overflowing &&
      inArea(mouseX, mouseY, this.x, this.y, this.w, this.h)
    ) {
      this.scrollY += scrollSpeed;
    }
    setContext(c);
  }

  addComponent(component) {
    this.components.push(component);
    return this;
  }
}

//Components to the UI Popup

export class ButtonWidget {
  onClick;
  looks = [];
  w;
  h;
  constructor(w, h, onClick) {
    this.w = w;
    this.h = h;
    this.onClick = onClick;
  }
  run(x, y, w, h, parent) {
    this.looks(x, y, this.w, this.h);
    if (inArea(mouseX, mouseY, x, y, this.w, this.h) && mousePressed) {
      this.onClick(parent);
    }
  }

  addLooks(l) {
    this.looks.push(l);
  }
}

export class ToggleWidget {
  onClick;
  looks = [];
  w;
  h;
  toggle = false;
  constructor(w, h, onClick, startingValue) {
    this.w = w;
    this.h = h;
    this.onClick = onClick;
    if (!!startingValue) this.toggle = startingValue;
  }

  run(x, y, w, h, parent) {
    this.looks(x, y, this.w, this.h);
    if (inArea(mouseX, mouseY, x, y, this.w, this.h) && mousePressed) {
      this.toggle = !this.toggle;
      this.onClick(this.toggle, parent);
    }
  }

  addLooks(l) {
    this.looks.push(l);
  }
}

//Looks

class rectangleLook {
  color = "blue";
  constructor(color) {
    this.color = color;
  }
  run(x, y, w, h) {
    fill(this.color);
    rect(x, y, w, h);
  }
}
class textLook {
  color = "white";
  text = "Sample Text";
  constructor(text, color) {
    this.text = text;
    this.color = color;
  }

  run(x, y, w, h) {
    fill(this.color);
    text(this.text, x + 3, y);
  }
}
