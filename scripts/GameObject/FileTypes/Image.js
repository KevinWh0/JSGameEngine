import { FileObject } from "./File.js";
export class ImageObject extends FileObject {
  constructor(dataURL) {
    this.data = dataURL;
    this.type = "Image";
  }
  setImage(dataURL) {
    this.data = dataURL;
  }
  getImage() {
    return this.data;
  }
}
