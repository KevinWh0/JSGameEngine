import {
  hightlightsColor,
  primaryUIColor,
  secondaryUIColor,
  textUIColor,
} from "./AssetManager.js";
import {
  fill,
  findTextFitSize,
  getContext,
  getFontSize,
  getTextWidth,
  height,
  inArea,
  mousePressed,
  mouseX,
  mouseY,
  rect,
  removeItem,
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
    for (let i = 0; i < this.looks.length; i++) {
      this.looks[i].run(x, y, this.w, this.h, this);
    }
    if (inArea(mouseX, mouseY, x, y, this.w, this.h) && mousePressed) {
      this.onClick(parent);
    }
  }

  addLooks(l) {
    this.looks.push(l);
    return this;
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
    for (let i = 0; i < this.looks.length; i++) {
      this.looks[i].run(x, y, this.w, this.h, this);
    }
    if (inArea(mouseX, mouseY, x, y, this.w, this.h) && mousePressed) {
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
/*export let looksOffset = [
  "TOP",
  "BOTTOM",
  "CENTERY",
  "CENTERX",
  "LEFT",
  "RIGHT",
];*/
export let looksOffsetMap = {
  TOP: (parent, UIWindow) => {
    parent.yOveride = 0;
  },
  BOTTOM: (parent, UIWindow) => {
    parent.yOveride = 0;
  },
  CENTERY: (parent, UIWindow) => {},
  CENTERX: (parent, UIWindow) => {},
  LEFT: (parent, UIWindow) => {},
  RIGHT: (parent, UIWindow) => {},
};

export let looksOffset = Object.keys(looksOffsetMap);

class looks {
  xOveride;
  yOveride;

  overideSettings;
  constructor() {}

  overidePosition(x, y) {
    overideSettings = {
      x: x,
      y: y,
    };
    if (!!looksOffsetMap[x]) {
      looksOffsetMap[x](this);
    } else this.xOveride = x;

    if (!!looksOffsetMap[y]) {
      looksOffsetMap[y](this);
    } else this.yOveride = y;

    //this.xOveride = x;
    //this.yOveride = y;
    return this;
  }
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
        this.looks[i](
          !this.xOveride ? x : this.xOveride,
          !this.yOveride ? y : this.yOveride,
          this.w,
          this.h,
          this
        );
      }
    }
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
  run(x, y, w, h) {
    fill(this.color);
    rect(
      !this.xOveride ? x : this.xOveride,
      !this.yOveride ? y : this.yOveride,
      w,
      h
    );
  }
}
export class textLook {
  color = "white";
  text = "Sample Text";
  xOffset;
  yOffset;
  constructor(text, color) {
    this.text = text;
    this.color = color;
  }

  run(x, y, w, h) {
    fill(this.color);
    //text(this.text, x + 3, y + getFontSize());
    text(
      this.text,
      !this.xOveride ? x : this.xOveride,
      (!this.yOveride ? y : this.yOveride) + getFontSize()
    );
  }
}
