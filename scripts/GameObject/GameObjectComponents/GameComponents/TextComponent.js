import { fill, textWraped } from "../../../toolbox";

export class TextComponent {
  type = "visual";
  componentName = "Text Component";
  data = {
    text: undefined,
  };

  constructor(text) {
    if (text != undefined) this.data.text = text;
  }
  run(parentObject) {
    console.log(this.data.text);
    fill("white");
    textWraped(
      this.data.text,
      parentObject.x,
      parentObject.y,
      parentObject.w,
      20
    );
  }

  setText(s) {
    this.data.text = s;
    return this;
  }

  getData() {
    return this.data.text + ', "' + this.data.font + '"';
  }
}
