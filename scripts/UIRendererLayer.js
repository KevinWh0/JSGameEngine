import {
  hightlightsColor,
  mainFont,
  primaryUIColor,
  secondaryUIColor,
  textUIColor,
} from "./AssetManager.js";
import {
  centerText,
  fill,
  fillGradient,
  findTextFitSize,
  getContext,
  getFontSize,
  getTextWidth,
  height,
  inArea,
  mouseDown,
  mousePressed,
  mouseX,
  mouseY,
  rect,
  removeItem,
  roundedRect,
  setContext,
  setFontSize,
  text,
  transitionRGB,
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

export function runUILayer() {
  UILayer.clear();

  UI.forEach((ui) => {
    ui.run();
  });

  for (let i = 0; i < UI.length; i++) {
    if (UI[i].garbage) UI = removeItem(UI, i);
  }
}

export function addToUILayer(u) {
  UI.push(u);
}

export class UIPopupPanel {
  x;
  y;
  w;
  h;
  title;
  scrollY;
  components = [];
  XCol;
  //If the components leave the bounds of the box it counts as overflowing
  overflowing = false;

  //tells the program if this is no longer needed, if its true the object will be destroyed
  garbage = false;

  //Drag window logic
  pinned;
  //it will lock when the mouse is pressed outside of the area to prevent it so if you drag over it wont pin it
  locked;
  pinXOffset;
  pinYOffset;

  constructor(x, y, w, h, title) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.title = title;
    this.scrollY = 0;
    this.XCol = textUIColor;
  }

  run() {
    let c = getContext();
    setContext(UILayer.context);
    //Move the window logic
    if (mouseDown) {
      if (this.pinned) {
        this.x = mouseX + this.pinXOffset;
        this.y = mouseY + this.pinYOffset;
      } else {
        if (
          inArea(mouseX, mouseY, this.x, this.y, this.w, 20) &&
          !this.locked
        ) {
          this.pinned = true;
          this.pinXOffset = this.x - mouseX;
          this.pinYOffset = this.y - mouseY;
        } else {
          this.locked = true;
        }
      }
    } else {
      this.locked = false;
      this.pinned = false;
    }

    fill(hightlightsColor);
    rect(this.x - 1, this.y - 1, this.w + 2, this.h + 2);
    fill(primaryUIColor);
    rect(this.x, this.y, this.w, this.h);

    fill(secondaryUIColor);
    rect(this.x, this.y, this.w, 20);
    if (
      inArea(
        mouseX,
        mouseY,
        this.x + this.w - getTextWidth("X") - 5,
        this.y,
        getTextWidth("X"),
        20
      )
    ) {
      this.XCol = transitionRGB(this.XCol, "rgb(255,0,0)", 10);
      if (mousePressed) this.garbage = true;
    } else {
      this.XCol = transitionRGB(this.XCol, textUIColor, 10);
    }

    fill(this.XCol);
    setFontSize(20, "Ubuntu");
    text("X", this.x + this.w - getTextWidth("X") - 5, this.y + 17);
    fill(textUIColor);
    //let text = this.title;
    //if(getTextWidth(text) > this.w - getTextWidth("X") - 5)text =
    if (!!this.title) text(this.title, this.x + 5, this.y + 17);

    let xPos = 5;
    let yPos = 25 - this.scrollY;
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

export let looksOffset = [
  "TOP",
  "BOTTOM",
  "CENTERY",
  "CENTERX",
  "LEFT",
  "RIGHT",
];
export let looksOffsetMap = {
  TOP: (parent, UIWindow) => {
    parent.yOveride = UIWindow.y;
  },
  BOTTOM: (parent, UIWindow) => {
    parent.yOveride = UIWindow.h - parent.h - 5 + UIWindow.y;
  },
  CENTERY: (parent, UIWindow) => {
    parent.yOveride = UIWindow.h / 2 - parent.h / 2 + UIWindow.y;
  },
  CENTERX: (parent, UIWindow) => {
    parent.xOveride = UIWindow.w / 2 - parent.w / 2 + UIWindow.x;
  },
  LEFT: (parent, UIWindow) => {
    parent.xOveride = UIWindow.x;
  },
  RIGHT: (parent, UIWindow) => {
    parent.xOveride = UIWindow.w - parent.w - 5 + UIWindow.x;
  },
};

class Widget {
  xOveride;
  yOveride;

  overideSettings;

  runInBackground(parent) {
    if (!!looksOffsetMap[this.overideSettings.x]) {
      looksOffsetMap[this.overideSettings.x](this, parent);
    } // else this.x = this.overideSettings.x;

    if (!!looksOffsetMap[this.overideSettings.y]) {
      looksOffsetMap[this.overideSettings.y](this, parent);
    } // else this.yOveride = this.overideSettings.y;

    for (let i = 0; i < this.looks.length; i++) {
      this.looks[i].run(this.xOveride, this.yOveride, this.w, this.h, this);
    }
  }
  overidePosition(x, y) {
    this.overideSettings = {
      x: x,
      y: y,
    };

    //this.xOveride = x;
    //this.yOveride = y;
    return this;
  }
}

export class ButtonWidget extends Widget {
  onClick;
  looks = [];
  w;
  h;
  constructor(w, h, onClick) {
    super();
    this.w = w;
    this.h = h;
    this.onClick = onClick;
  }
  run(x, y, w, h, parent) {
    this.xOveride = x;
    this.yOveride = y;
    this.runInBackground(parent);

    if (
      inArea(mouseX, mouseY, this.xOveride, this.yOveride, this.w, this.h) &&
      mousePressed
    ) {
      this.onClick(parent);
    }
  }

  addLooks(l) {
    this.looks.push(l);
    return this;
  }
}

export class ToggleWidget extends Widget {
  onClick;
  looks = [];
  w;
  h;
  toggle = false;
  constructor(w, h, onClick, startingValue) {
    super();
    this.w = w;
    this.h = h;
    this.onClick = onClick;
    if (!!startingValue) this.toggle = startingValue;
  }

  run(x, y, w, h, parent) {
    this.xOveride = x;
    this.yOveride = y;
    this.runInBackground(parent);

    if (
      inArea(mouseX, mouseY, this.xOveride, this.yOveride, this.w, this.h) &&
      mousePressed
    ) {
      this.toggle = !this.toggle;
      this.onClick(this.toggle, parent);
    }
  }

  addLooks(l) {
    this.looks.push(l);
    return this;
  }
}

//Looks

class looks {
  xOveride;
  yOveride;

  constructor() {}

  runInBackground(parent) {}
}

export class lookLogic extends looks {
  looks = [];
  condition;
  constructor(condition) {
    super();
    this.condition = condition;
  }

  run(x, y, w, h, parent) {
    if (this.condition()) {
      for (let i = 0; i < this.looks.length; i++) {
        this.looks[i](x, y, this.w, this.h, this);
      }
    }
    this.runInBackground(parent);
  }

  addLooks(l) {
    this.looks.push(l);
  }
}

export class rectangleLook extends looks {
  color = "blue";
  constructor(color) {
    super();
    this.color = color;
  }
  run(x, y, w, h, parent) {
    fill(this.color);
    rect(x, y, w, h);
    this.runInBackground(parent);
  }
}
export class roundRectangleLook extends looks {
  color = "blue";
  constructor(color) {
    super();
    this.color = color;
  }
  run(x, y, w, h, parent) {
    fill(this.color);
    roundedRect(x, y, w, h, 4);
    this.runInBackground(parent);
  }
}

export class roundRectangleGradientLook extends looks {
  color1 = "blue";
  color2 = "red";

  constructor(color1, color2) {
    super();
    this.color1 = color1;
    this.color2 = color2;
  }
  run(x, y, w, h, parent) {
    fillGradient(this.color1, this.color2, x, y, x, y + h);
    roundedRect(x, y, w, h, 4);
    this.runInBackground(parent);
  }
}

export class textLook extends looks {
  color = "white";
  text = "Sample Text";
  xOffset;
  yOffset;
  fontSize;
  constructor(text, color, fontSize) {
    super();
    this.text = text;
    this.color = color;
    this.fontSize = fontSize;
  }

  run(x, y, w, h, parent) {
    fill(this.color);
    if (!!this.fontSize) setFontSize(this.fontSize, mainFont);
    //text(this.text, x + 3, y + getFontSize());
    text(this.text, centerText(this.text, x, w), y + getFontSize() * 1.5);
    this.runInBackground(parent);
  }
}
