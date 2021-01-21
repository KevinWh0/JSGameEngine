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

  constructor(script) {
    if (script != undefined) data.script = script;
  }
  run(parentObject) {}

  setScript(s) {
    data.script = s;
  }

  getData() {
    return this.data.script;
  }
}
