import { assets } from "./GameAssets/AssetHandler.js";
import { GameObject } from "./GameObject/GameObject.js";
import {
  componentsMap,
  fileMap,
  objects,
  setObjects,
} from "./GameObject/ObjectHandler.js";
import { jsonFromClass, readTextFile, returnCopy } from "./toolbox.js";

export function saveProject(callback) {
  let json = {
    Objects: [],
    Assets: [],
  };
  objects.forEach((i) => {
    json.Objects.push(i);
  });
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

export function loadProject(dat) {
  (async () => {
    let data = JSON.parse(dat);
    //let data = JSON.parse(await readTextFile("../test.json"));
    let _assets = data.Assets;
    let _objects = data.Objects;
    //console.log(_assets);
    _assets.forEach((element) => {
      let asset = returnCopy(fileMap.get(element.type));
      jsonFromClass(asset, element);
      asset.setData(element.data);
      assets.set(element.Name, asset);
    });

    setObjects([]);
    console.log(_objects);
    _objects.forEach((element) => {
      let obj = new GameObject(element.x, element.y, element.w, element.h);
      jsonFromClass(obj, element);

      obj.components = [];
      element.components.forEach((i) => {
        let component = returnCopy(componentsMap.get(i.componentName));
        jsonFromClass(component, i);
        obj.addComponent(component);
      });
      element.editorComponents.forEach((i) => {
        let component = returnCopy(componentsMap.get(i.componentName));
        jsonFromClass(component, i);
        obj.addEditorComponent(component);
      });
      //returnCopy(componentsMap.get(element.type))
      objects.push(obj);
      console.log(obj);
    });
  })();
}
