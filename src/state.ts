export function drawState(
	ctx: CanvasRenderingContext2D,
	turn: number = 0,
	rotation: number = 0
): void {
	let color = "#e0e0f0";
	let r = 30;
	let s = 100;
	let c = 525;
	let pi = Math.PI;

	// turn
	let w = 150;
	let h = 4;
	let rd = 2;
	let y = 525 + s + 5;

	ctx.save();
	ctx.translate(525, 525);
	ctx.rotate([0, -pi/2, pi, pi/2][turn]);
	ctx.translate(-525, -525);

	ctx.fillStyle = "#ffcc33";
	ctx.beginPath();
	ctx.moveTo(c, y);
	ctx.lineTo(c - w/2 + rd, y);
	ctx.quadraticCurveTo(c - w/2, y, c - w/2, y + rd);
	ctx.lineTo(c - w/2, y + h - rd);
	ctx.quadraticCurveTo(c - w/2, y + h, c - w/2 + rd, y + h);
	ctx.lineTo(c + w/2 - rd, y + h);
	ctx.quadraticCurveTo(c + w/2, y + h, c + w/2, y + h - rd);
	ctx.lineTo(c + w/2, y + rd);
	ctx.quadraticCurveTo(c + w/2, y, c + w/2 - rd, y);
	ctx.lineTo(c, y);
	
	ctx.fill();
	ctx.stroke();

	ctx.restore();

	// big rectangle
	ctx.save();
	ctx.translate(525, 525);
	ctx.rotate(rotation);
	ctx.translate(-525, -525);

	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.moveTo(c - s, c);
	ctx.lineTo(c - s, c + s - r);
	ctx.quadraticCurveTo(c - s, c + s, c - s + r, c + s);
	ctx.lineTo(c + s - r, c + s);
	ctx.quadraticCurveTo(c + s, c + s, c + s, c + s - r);
	ctx.lineTo(c + s, c - s + r);
	ctx.quadraticCurveTo(c + s, c - s, c + s - r, c - s);
	ctx.lineTo(c - s + r, c - s);
	ctx.quadraticCurveTo(c - s, c - s, c - s, c - s + r);
	ctx.lineTo(c - s, c);

	ctx.fill();
	ctx.stroke();

	// winds
	ctx.fillStyle = "#000000";
	ctx.font = "40px garamond";
	
	ctx.fillText("Est", 505, 515 + s);

	ctx.save();
	ctx.translate(525, 525);
	ctx.rotate(-3.141592/2);
	ctx.translate(-525, -525);
	ctx.fillText("Sud", 500, 515 + s);
	ctx.restore();
	
	ctx.save();
	ctx.translate(525, 525);
	ctx.rotate(3.141592);
	ctx.translate(-525, -525);
	ctx.fillText("Ouest", 480, 515 + s);
	ctx.restore();

	ctx.save();
	ctx.translate(525, 525);
	ctx.rotate(3.141592/2);
	ctx.translate(-525, -525);
	ctx.fillText("Nord", 485, 515 + s);
	ctx.restore();

	ctx.restore();
}
