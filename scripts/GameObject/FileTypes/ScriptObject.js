import { FileObject } from "./File.js";
export class ScriptObject extends FileObject {
  constructor(code) {
    super();
    this.data = code;
    this.type = "Script";
  }

  setScript(code) {
    this.data = code;
  }
  getScript() {
    return this.data;
  }
}
