import { Line } from './utils.js';
import Victor from './vic.js';

export class Arm {
	constructor(num_, len_, ctx_) {
		this.segments = new Array(50);
		this.num = num_;
		this.len = len_;
		this.ctx = ctx_;
		this.stuck = false;
		this.xPos = 100;
		this.yPos = 100;
		this.animated = false;
		this.animStyle = 1;

		this.init();
	}

	init() {
		this.segments[0] = new Segment(250, 250, this.len, this.ctx);
		for (let i = 1; i < 50; i++) {
			this.segments[i] = new Segment(
				this.segments[i - 1].b.x,
				this.segments[i - 1].b.y,
				this.len,
				this.ctx
			);
		}
	}

	follow(target) {
		this.segments[0].point(target);
		this.segments[0].calcB();
		for (let i = 1; i < this.num; i++) {
			this.segments[i].point(this.segments[i - 1].a);
			this.segments[i].calcB();
		}
	}

    stick() {
        let segs = this.segments;
        segs[this.num - 1].a = Victor(this.xPos, this.yPos);
        segs[this.num - 1].calcB();
        for (let i = this.num-2; i >= 0; i--) {
            segs[i].a = segs[i+1].b;
            segs[i].calcB();
        }
    }

	show() {
		for (let i = 0; i < this.num; i++) {
			if (this.segments[i].len !== this.len) this.segments[i].len = this.len;
			this.segments[i].show();
		}

		// this.segments.forEach((seg) => {
		// 	seg.show();
		// });
	}
}

class Segment {
	constructor(x_, y_, len_, ctx_) {
		this.a = new Victor(x_, y_);
		this.len = len_;
		this.ctx = ctx_;
		this.angle = 0;
		this.b = new Victor();
	}

	point(mousePos) {
		let target = new Victor(mousePos.x, mousePos.y);
		let dir = target.clone().subtract(this.a);
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
		new Line(this.a.x, this.a.y, this.b.x, this.b.y, this.ctx).draw();
	}
}
