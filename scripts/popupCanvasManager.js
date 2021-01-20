export let game = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.id = "popupLayerCanvas";
    this.context = this.canvas.getContext("2d");
    document.getElementById("canvasHolder").appendChild(this.canvas);
    this.frameNo = 0;
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};

export let popupAction = {
  roundedRect: (x, y, width, height, radius) => {
    let ctx = game.context;
    if (typeof radius === "undefined") {
      radius = 5;
    }
    //ctx.fillRect(x, y, width, height);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  },
  fill: (col) => {
    game.context.fillStyle = col;
  },
  rect: (x, y, w, h) => {
    game.context.fillRect(x, y, w, h);
  },
};
