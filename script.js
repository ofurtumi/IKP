import Victor from "./vic.js";

let canvas;
let ctx;

let sliders;
let values;

let control;

let movementSelect;
let movementType = 1;

let lines = [];

let u = 0;

let mouse = { x: 0, y: 0 };

window.onload = () => {
  canvas = document.querySelector("#c");
  ctx = canvas.getContext("2d");

  sliders = document.querySelectorAll(".cell input");
  values = document.querySelectorAll(".cell span");

  document.querySelector(".prison").addEventListener("input", () => {
    for (let i = 0; i < sliders.length; i++) {
      values[i].textContent = sliders[i].value;
    }

    init(
      Number(sliders[0].value),
      Number(sliders[1].value),
      Number(sliders[2].value),
      Number(sliders[3].value)
    );
  });

  document
    .querySelector("#control")
    .addEventListener("change", () => (control = !control));

  movementSelect = document.querySelector("#movement");
  movementSelect.addEventListener(
    "change",
    () => (movementType = Number(movementSelect.value))
  );

  canvas.addEventListener("mousemove", (e) => {
    mouse = getMousePos(canvas, e);
  });

  init(10, 20, 20, -2);
  animate();
};

/**
 * Tekur við upphafskilirðum og frumstillir
 * @param {Uint} segs fjöldi hluta í arminum
 * @param {Uint} len lengd hvers hluts í arminum
 * @param {Uint} width vídd fremsta hluta armsins
 * @param {int} mod breyting á vídd milli hluta
 */
function init(segs = 20, len = 10, width = 20, mod = -2) {
  // * smá cleanup til að laga memory leaks B)
  // ! virkaði ekki btw :'(
  if (lines.length > 0) {
    for (let i = 0; i < lines.length; i++) {
      lines[i] = null;
    }
  }
  lines.length = 0;

  // * býr til nýjann arm / orm, byrjar á fremsta hluta og notar hann svo sem reference alla leið niður
  lines[0] = new Segment(250, 250, 0, len, "#f00", width);
  for (let i = 1; i < segs; i++) {
    lines[i] = new Segment(
      lines[i - 1].b.x,
      lines[i - 1].b.y,
      0,
      len,
      "#000",
      width + mod * i
    );
  }
}

function animate() {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, 500, 500);

  control ? lines[0].point(mouse) : lines[0].point(getMathCoord());

  lines[0].calcB();
  lines[0].show("#f00", 5);

  for (let i = 1; i < lines.length; i++) {
    lines[i].point(lines[i - 1].a);
    lines[i].calcB();
    lines[i].show();
  }

  window.requestAnimationFrame(animate);
}

function getMathCoord() {
  let x_;
  let y_;

  if (movementType === 1) {
    x_ = 250 + Math.cos(u / 20) * 200;
    y_ = 250 + Math.sin(u / 10) * 100;
  } else if (movementType === 2) {
    x_ = 250 + Math.cos(u / 20) * 200;
    y_ = 250 + Math.sin(u / 20) * 200;
  }

  u++;

  mouse = { x: x_, y: y_ };
  return mouse;
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}

class Segment {
  constructor(x_, y_, angle_, len_, color_ = "#000", width_ = 5) {
    this.a = new Victor(x_, y_);
    this.angle = angle_;
    this.len = len_;
    this.color = color_;
    this.width = width_;
    this.b = new Victor();
  }

  point(mousePos) {
    let target = new Victor(mousePos.x, mousePos.y);
    let dir = target.clone().subtract(this.a);
    // this.len = target.length()
    this.angle = dir.verticalAngle();
    dir = dir.normalize().multiplyScalar(this.len * -1);
    this.a = target.add(dir);
  }

  calcB() {
    let dx = this.len * Math.sin(this.angle);
    let dy = this.len * Math.cos(this.angle);
    this.b.x = this.a.x + dx;
    this.b.y = this.a.y + dy;
  }

  show() {
    new Line(this.a.x, this.a.y, this.b.x, this.b.y).draw(
      this.color,
      this.width
    );
  }
}

class Line {
  constructor(x1_, y1_, x2_, y2_) {
    this.x1 = x1_;
    this.y1 = y1_;
    this.x2 = x2_;
    this.y2 = y2_;
  }

  draw(color = "#000", weight = 2) {
    ctx.strokeStyle = color;
    ctx.lineWidth = weight;
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();
  }
}
