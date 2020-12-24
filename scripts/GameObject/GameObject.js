export let inEditor = true;

export class GameObject {
  x;
  y;
  w;
  y;
  enabled = true;
  components = [];

  name;
  /* These are components that will only be active when the game is not exported */
  type;
  editorComponents = [];
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.type = "Object";
  }

  setType(type) {
    this.type = type;
    return this;
  }
  update() {
    if (this.enabled) {
      this.components.forEach((component) => {
        component.run(this);
      });

      if (inEditor)
        this.editorComponents.forEach((component) => {
          component.run(this);
        });
    }
  }

  addComponent(component) {
    this.components.push(component);
    return this;
  }

  addEditorComponent(component) {
    this.editorComponents.push(component);
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  setName(name) {
    this.name = name;
    return this;
  }
}
