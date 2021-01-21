import { FileObject } from "./File.js";
export class AudioObject extends FileObject {
  constructor(dataURL) {
    super();
    this.data = new Audio(dataURL);
    //this.data.src = dataURL;
    this.type = "Audio";
  }
  setAudio(dataURL) {
    this.data = dataURL;
  }
  getAudio() {
    return this.data;
  }

  play() {
    this.data.play();
  }
}
