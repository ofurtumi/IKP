let canvas;
let ctx;
let tempVec;
let temp;
let tempVec2;
let temp2;
i = 0;

function init() {
  canvas = document.querySelector("#c");
  ctx = canvas.getContext("2d");
  tempVec = new Vec(50, 50);
  temp = new Line(50, 50, tempVec, ctx);
  tempVec2 = new Vec(25, 25);
  temp2 = new Line(temp.x - tempVec2.w, temp.y - tempVec2.h, tempVec2, ctx);
  animate();
}

function animate() {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  temp.moveBy(10 * Math.sin(i++), 0);
  temp.draw();
  temp2.draw();
  window.requestAnimationFrame(animate);
}

class Line {
  constructor(x_, y_, vec_, ctx_) {
    this.x = x_;
    this.y = y_;
    this.vec = vec_;
    this.ctx = ctx_;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(this.x + this.vec.w, this.y + this.vec.h);
    this.ctx.fillStyle = "#f00";
    this.ctx.stroke();
  }

  moveBy(x_, y_) {
    this.x += x_;
    this.y += y_;
  }

  move(x_, y_) {
    this.x = x_;
    this.y = y_;
  }
}

class Vec {
  constructor(w_, h_) {
    this.w = w_;
    this.h = h_;
    this.len = 0;
    this.setLen();
  }

  setWidth(w_) {
    this.w = w_;
    this.setLen();
  }

  setHeight(h_) {
    this.h = h_;
    this.setLen();
  }

  setLen() {
    this.len = Math.sqrt(this.w * this.w + this.h * this.h);
  }
}
