import { assets } from "./GameAssets/AssetHandler.js";
import { objects } from "./GameObject/ObjectHandler.js";
import {
  findFunctionName,
  insertFirst,
  readTextFile,
  replaceAll,
  getWordsBetweenCurlBracket,
  getWordsOutsideCurlBracket,
  getFunc,
  getVars,
  getList,
} from "./toolbox.js";

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
      } else if (Assets[i].type == "Script") {
        let finalScript = "";

        let classVars = [];

        let rawOutsideCurlBrackets = getWordsOutsideCurlBracket(Assets[i].data)
          .join("\n")
          .replace(/let|var/g, "")
          .split(";");
        console.log(getWordsOutsideCurlBracket(Assets[i].data));

        let finalGlobalVars = "";
        let finalVars = [];

        //This part of the code generates the final string for all the global vars
        //(The ones not declared in a function and will last longer than 1 frame)
        rawOutsideCurlBrackets.forEach((vars) => {
          if (vars.length == 0) return;
          let v = vars.split("=");
          let varName = v[0].trim().split(" ");
          v[0] = varName[varName.length - 1];

          if (v.length < 2) {
            finalVars.push(/*"let " + */ v[0] + ";");
          } else {
            v[1] = v[1].trim();
            finalVars.push(/*"let " + */ v[0] + " =  " + v[1] + ";");
          }
          classVars.push(v[0]);
          finalGlobalVars = finalVars.join("\n");
        });
        finalGlobalVars = finalGlobalVars.replace(/};/, "");

        finalScript = finalScript + finalGlobalVars;

        //Now generate the functions and replace the global vars to start with this.var
        let classFunctions = getFunc(Assets[i].data);

        classFunctions.forEach((cf) => {
          let newFunc = null;
          if (newFunc == null) {
            classVars.push(cf.split(" ")[1].split("(")[0]);
            newFunc = cf.replace("function ", "");
          }
          classVars.forEach((cv) => {
            //The use of VAR is depricated
            let vars = newFunc.replace(
              new RegExp(`(?<!let )${cv}(?=[^a-z])(?=[^.])`),
              `this.${cv}`
            );
            newFunc = vars;
            //console.log(newFunc);
          });

          //console.log(newFunc.substr(5, newFunc.length));
          finalScript = finalScript + newFunc.substr(5, newFunc.length);

          //classVars
        });

        console.log(
          `class ${AssetNames[i].replace(/\./, "_")} {` + finalScript + `}`
        );

        exportedAssets =
          exportedAssets +
          `  assets.set("${AssetNames[i]}", new ${
            Assets[i].constructor.name
          }(${JSON.stringify(Assets[i].data)}));  `;
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
      let objBuilder = `new GameObject(${objects[i].x}, ${objects[i].y}, ${objects[i].w}, ${objects[i].h}, "${objects[i].name}", "${objects[i].type}", ${objects[i].enabled})`;
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
          /*
            Game made with https://kevinwh0.github.io/JSGameEngine/
          */
          init();
        </script>
      `);
  })();
}
