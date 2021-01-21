import { assets } from "./GameAssets/AssetHandler.js";
import { objects } from "./GameObject/ObjectHandler.js";
import { readTextFile, replaceAll } from "./toolbox.js";

export function compileGame(callback) {
  (async () => {
    let exportedAssets = "";
    let exportedObjects = "";
    let Assets = Array.from(assets.values());
    let AssetNames = Array.from(assets.keys());
    for (let i = 0; i < Assets.length; i++) {
      if (Assets[i].type == "Image" || Assets[i].type == "Audio") {
        exportedAssets =
          exportedAssets +
          `  assets.set("${AssetNames[i]}", new ${
            Assets[i].constructor.name
          }(${JSON.stringify(Assets[i].data.src)}));  `;
      } else {
        exportedAssets =
          exportedAssets +
          `  assets.set("${AssetNames[i]}", new ${
            Assets[i].constructor.name
          }(${JSON.stringify(Assets[i].data)}));  `;
      }
    }
    //exportedObjects
    for (let i = 0; i < objects.length; i++) {
      let objBuilder = `new GameObject(${objects[i].x}, ${objects[i].y}, ${objects[i].w}, ${objects[i].h}, "${objects[i].name}", ${objects[i].enabled})`;
      //These lines crash it
      let components = objects[i].components;
      try {
        components.forEach((component) => {
          objBuilder =
            objBuilder +
            `.addComponent(new ${
              component.constructor.name
            }("${component.getData()}"))`;
        });
        /*
            for (let j = 0; j < components.length; j++) {
              //console.log(components.length + " " + j);
    
              let comp = components.components[j];
              console.log(comp, j, components.length);
              objBuilder =
                objBuilder +
                `.addComponent(new ${comp.constructor.name}(${comp.getData()}))`;
            }*/
      } catch (err) {
        console.error(err);
      }

      exportedObjects = exportedObjects + `objects.push(${objBuilder});`;
    }

    var data = await readTextFile("scripts/GameLibs/gameToolbox.js");
    data = replaceAll(data, "export", "");
    data = replaceAll(data, `//!!!`, "");

    await callback(`
        <style>
        * {
          margin: 0;
          padding: 0;
        }
        </style>
        <div id="canvasHolder"></div>
        <script>    
    
          ${data}
          ${exportedAssets}
          ${exportedObjects}
        </script>
      `);
  })();
}
