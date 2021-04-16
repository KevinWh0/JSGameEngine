import { FileObject } from "./File.js";

export class FontObject extends FileObject {
  fontName;
  constructor(data, name) {
    super(data);
    this.type = "Font" /*File type Goes here*/;
    try {
      this.fontName = this.data.font.replace(/ /g, "_").replace(/./g, "-");
    } catch (error) {}
    var font = new FontFace(this.fontName, `url(${this.data})`);
    document.fonts.add(font);
  }

  get() {
    return this.data;
  }

  //This function is used when loading the serialised JSON
  setData(d) {
    this.data = d;
    var font = new FontFace(this.fontName, `url(${this.data})`);
    document.fonts.add(font);
  }
}
