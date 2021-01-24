export class FileObject {
  constructor(data) {
    this.data = data;
  }
  type = "File" /*File type Goes here*/;
  data = "" /* General file data goes here*/;

  //This function is used when loading the serialised JSON
  setData(d) {
    this.data = d;
  }
}
