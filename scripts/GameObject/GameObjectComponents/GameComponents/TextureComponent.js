import { assets } from "../../../GameAssets/AssetHandler.js";
import {
  fillGameCanvas,
  rectGameCanvas,
  renderImageGameCanvas,
} from "../../../CompilerLibs/gameCanvasRendering.js";
import { noTextureSelected } from "../../../AssetManager.js";
export class TexturedObjectComponent {
  type = "visual";
  componentName = "Textured Component";
  data = {
    image: null,
  };

  constructor() {}

  run(parentObject) {
    //console.log(assets.get(this.data.image));
    if (this.data.image != null)
      renderImageGameCanvas(
        assets.get(this.data.image).getImage(),
        parentObject.x,
        parentObject.y,
        parentObject.w,
        parentObject.h
      );
    else {
      renderImageGameCanvas(
        noTextureSelected,
        parentObject.x,
        parentObject.y,
        parentObject.w,
        parentObject.h
      );
    }
  }

  getData() {
    return this.data.image;
  }
}
