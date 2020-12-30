import { FileObject } from "./File.js";
export class ImageObject extends FileObject {
  constructor(dataURL) {
    super();
    this.data = new Image();
    this.data.src = dataURL;
    this.type = "Image";
  }
  setImage(dataURL) {
    this.data = dataURL;
  }
  getImage() {
    return this.data;
  }
}