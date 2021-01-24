import { FileObject } from "./File.js";
export class AudioObject extends FileObject {
  constructor(dataURL) {
    super();
    if(!!dataURL)
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

  //This function is used when loading the serialised JSON
  setData(d) {
    this.data = new Audio(d);
  }
}
