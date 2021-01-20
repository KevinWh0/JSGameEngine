import { assets } from "../../../GameAssets/AssetHandler.js";
import {
  fillGameCanvas,
  rectGameCanvas,
  renderImageGameCanvas,
} from "../../../GameLibs/gameCanvasRendering.js";
import { noTextureSelected } from "../../../AssetManager.js";
export class ScriptComponent {
  type = "code";
  componentName = "Script Component";
  data = {
    script: null,
  };

  constructor() {}

  run(parentObject) {}
}
