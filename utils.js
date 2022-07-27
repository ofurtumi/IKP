export class Line {
	constructor(x1_, y1_, x2_, y2_, ctx_) {
		this.x1 = x1_;
		this.y1 = y1_;
		this.x2 = x2_;
		this.y2 = y2_;
		this.ctx = ctx_;
	}

	draw(color = '#0f0', weight = 5) {
		this.ctx.strokeStyle = color;
		this.ctx.lineWidth = weight;
		this.ctx.beginPath();
		this.ctx.moveTo(this.x1, this.y1);
		this.ctx.lineTo(this.x2, this.y2);
		this.ctx.stroke();
	}
}

export function getAnimationCoord(type, i, offset) {
	let x_;
	let y_;

	if (type === 1) {
		x_ = offset + Math.cos(i / 20) * 200;
		y_ = offset + Math.sin(i / 10) * 100;
	} else if (type === 2) {
		x_ = offset + Math.cos(i / 20) * 200;
		y_ = offset + Math.sin(i / 20) * 200;
	}

	return { x: x_, y: y_ };
}

export function newInput(type, name, val, listener = null, min = null, max = null) {
	let div = document.createElement('div');
	div.classList.add("cot")

	// * span sem heldur utan um stutt nafn
	let nameSpan = document.createElement('span');
	nameSpan.textContent = name;

	// * span sem heldur utan um núverandi gildi inputsins
	let valueSpan = document.createElement('span');
	valueSpan.textContent = val;

	// * inputið sjálft, tekur þá týpu og eventlistener sem voru gefin
	let input = document.createElement('input');
	input.type = type;
	input.value = val;
	if (min) input.setAttribute('min', min);
	if (max) input.setAttribute('max', max);

	input.addEventListener('input', (e) => {
		valueSpan.textContent = input.value;
		listener(e);
	});
	div.append(nameSpan, input, valueSpan);

	return div;
	// document.querySelector('body').appendChild(div);
}
