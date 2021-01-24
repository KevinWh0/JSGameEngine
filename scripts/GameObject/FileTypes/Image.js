import { FileObject } from "./File.js";
export class ImageObject extends FileObject {
  constructor(dataURL) {
    super();
    if(!!dataURL){
      this.data = new Image();
      this.data.src = dataURL;
    }
    this.type = "Image";
  }
  setImage(dataURL) {
    this.data = dataURL;
  }
  getImage() {
    return this.data;
  }

  //This function is used when loading the serialised JSON
  setData(d) {
    this.data = new Image();
    this.data.src = d;
  }
}
