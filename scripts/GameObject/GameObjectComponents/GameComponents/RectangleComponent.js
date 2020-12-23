import {
  fillGameCanvas,
  rectGameCanvas,
} from "../../../GameLibs/gameCanvasRendering.js";

export class RectangleObjectComponent {
  data = {
    color: "purple",
  };

  constructor(color) {
    this.data.color = color;
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
}
