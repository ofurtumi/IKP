import Victor from './vic.js';
let v = new Victor(20, 20);
let canvas;
let ctx;

let segmentN;
let lengthN;
let widthN;
let modN;

let lines;

let u = 0;

let mouse = { x: 0, y: 0 };

window.onload = () => {
	canvas = document.querySelector('#c');
	ctx = canvas.getContext('2d');

	segmentN = document.querySelector('#segments');
	lengthN = document.querySelector('#length');
	widthN = document.querySelector('#width');
	modN = document.querySelector('#modifier');

	segmentN.addEventListener('input', () => {
		document.querySelector('#sN').textContent = segmentN.value;
	});
	lengthN.addEventListener('input', () => {
		document.querySelector('#lN').textContent = lengthN.value;
	});
	widthN.addEventListener('input', () => {
		document.querySelector('#wN').textContent = widthN.value;
	});
	modN.addEventListener('input', () => {
		document.querySelector('#mN').textContent = modN.value;
	});

	document.querySelector('#change').addEventListener('click', () => {
		init(
			Number(segmentN.value),
			Number(lengthN.value),
			Number(widthN.value),
			Number(modN.value)
		);
	});

	init(20, 10, 5, 3);
};

/**
 * Tekur við upphafskilirðum og frumstillir
 * @param {Uint} segs fjöldi hluta í arminum
 * @param {Uint} len lengd hvers hluts í arminum
 * @param {Uint} width vídd fremsta hluta armsins
 * @param {int} mod breyting á vídd milli hluta
 */
function init(segs = 20, len = 10, width = 20, mod = -2) {
	lines = new Array(segs);

	canvas.addEventListener('mousemove', (e) => {
		mouse = getMousePos(canvas, e);
	});

	lines[0] = new Segment(250, 250, 0, len, '#f00', width);
	for (let i = 1; i < lines.length; i++) {
		lines[i] = new Segment(
			lines[i - 1].b.x,
			lines[i - 1].b.y,
			0,
			len,
			'#000',
			width + mod * i
		);
	}

	animate();
}

function animate() {
	ctx.fillStyle = '#fff';
	ctx.fillRect(0, 0, 500, 500);

	lines[0].point(mouse);
	// lines[0].point({x: 250 + 100 * Math.sin(u++ / 20), y: 200 + 100 * Math.cos(u / 20)})
	lines[0].calcB();
	lines[0].show('#f00', 5);

	for (let i = 1; i < lines.length; i++) {
		lines[i].point(lines[i - 1].a);
		lines[i].calcB();
		lines[i].show();
	}

	window.requestAnimationFrame(animate);
}

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top,
	};
}

class Segment {
	constructor(x_, y_, angle_, len_, color_ = '#000', width_ = 5) {
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

	draw(color = '#000', weight = 2) {
		ctx.strokeStyle = color;
		ctx.lineWidth = weight;
		ctx.beginPath();
		ctx.moveTo(this.x1, this.y1);
		ctx.lineTo(this.x2, this.y2);
		ctx.stroke();
	}
}
