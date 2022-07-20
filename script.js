let canvas;
let ctx;
let tempVec;
let temp;
let tempVec2;
let temp2;
i = 0;

function init() {
	canvas = document.querySelector('#c');
	ctx = canvas.getContext('2d');
	tempVec = new Vec(25, 25);
	temp = new Line(175, 175, tempVec, ctx);
	tempVec2 = new Vec(25, 25);
	temp2 = new Line(temp.sx, temp.sy, tempVec2, ctx);
	animate();
}

function animate() {
	ctx.fillStyle = '#fff';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	temp.moveBy(10 * Math.cos(i / 10), 10 * Math.sin(i++ / 10));
	temp2.moveTo(temp.sx - temp2.vec.w, temp.sy - temp2.vec.h);
	temp2.set;
	temp.draw('#f00');
	temp2.draw();
	window.requestAnimationFrame(animate);
}

class Line {
	constructor(startX, startY, vec_, ctx_) {
		this.sx = startX;
		this.sy = startY;
		this.vec = vec_;
		this.ctx = ctx_;
		this.ex = this.sx + this.vec.x;
		this.ey = this.sy + this.vec.y;
	}

	draw(color = '#000') {
		this.ctx.strokeStyle = color;
		this.ctx.beginPath();
		this.ctx.moveTo(this.sx, this.sy);
		this.ctx.lineTo(this.sx + this.vec.w, this.sy + this.vec.h);
		this.ctx.stroke();
	}

	moveBy(x_, y_) {
		this.sx += x_;
		this.sy += y_;
	}

	moveTo(x_, y_) {
		this.sx = x_;
		this.sy = y_;
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
