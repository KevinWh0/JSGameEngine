export class TextComponent {
  type = "visual";
  componentName = "Text Component";
  data = {
    text: undefined,
  };

  constructor(text) {
    if (text != undefined) this.data.text = text;
  }
  run(parentObject) {}

  setText(s) {
    this.data.text = s;
    return this;
  }

  getData() {
    return this.data.text;
  }
}
