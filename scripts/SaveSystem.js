import { assets } from "./GameAssets/AssetHandler.js";
import { objects } from "./GameObject/ObjectHandler.js";

export function saveProject(callback) {
  let json = {
    Objects: JSON.stringify(objects),
    Assets: [],
  };

  /*objects.forEach((i) => {
    let components = [];

    i.components.forEach((j) => {
      components.push({
        componentName: j.componentName,
        type: j.type,
        data: j.data,
      });
    });

    json.Objects.push({
      name: i.name,
      type: i.type,
      enabled: i.enabled,
      components: components,
      editorComponents: [],
      x: i.x,
      y: i.y,
      w: i.w,
      h: i.h,
    });
  });
  */

  let Assets = Array.from(assets.values());
  let AssetNames = Array.from(assets.keys());
  for (let i = 0; i < Assets.length; i++) {
    if (Assets[i].type == "Script" || Assets[i].type == "File")
      json.Assets.push({
        Name: AssetNames[i],
        type: Assets[i].type,
        data: Assets[i].data,
      });
    else
      json.Assets.push({
        Name: AssetNames[i],
        type: Assets[i].type,
        data: Assets[i].data.src,
      });
  }

  callback(JSON.stringify(json, "\n"));
}
