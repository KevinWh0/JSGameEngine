import {
  fillGameCanvas,
  rectGameCanvas,
} from "../../../GameLibs/gameCanvasRendering.js";

export class RectangleObjectComponent {
  type = "visual";
  componentName = "Rectangle Component";
  data = {
    color: "purple",
  };

  constructor(color) {
    this.data.color = color /*Math.random() > 0.5 ? "red" : "purple"*/;
  }

  run(parentObject) {
    fillGameCanvas(this.data.color);
    rectGameCanvas(
      parentObject.x,
      parentObject.y,
      parentObject.w,
      parentObject.h
    );
  }

  setCol(col) {
    this.data.color = col;
  }

  getData() {
    return this.data.color;
  }
}
