type button_t = (
	arg0: CanvasRenderingContext2D,
	arg1: number,
	arg2: number
) => void;

export function clickAction(
	x: number,
	y: number,
	chii: boolean,
	pon: boolean,
	kan: boolean,
	ron: boolean,
	tsumo: boolean
): number {
	let buttons = [
		chii,
		pon,
		kan,
		ron,
		tsumo
	]
	if (buttons.some(c => c)) {
		buttons.unshift(true);
	} else {
		return -1;
	}
	let dx = 0;
	let size = 0.6;
	let xmin = 1025 - buttons.filter(c => c).length * 3 * size;
	console.log(x > xmin, "\n");
	return -1;
}

export function drawButtons(
	ctx: CanvasRenderingContext2D,
	chii: boolean,
	pon: boolean,
	kan: boolean,
	ron: boolean,
	tsumo: boolean
): void {
	let buttons = [
		[chii, buttonChii],
		[pon, buttonPon],
		[kan, buttonKan],
		[ron, buttonRon],
		[tsumo, buttonTsumo]
	]
	if (buttons.some(c => c[0])) {
		buttons.unshift([true, buttonPass]);
	}
	let dx = 0;
	for (let i = 0; i < buttons.length; i++) {
		if (buttons[i][0]) {
			(buttons[i][1] as button_t)(
				ctx,
				850 - dx * 120,
				835
			);
			dx++;
		}
	}
}

function button(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	r: number,
	w: number,
	h: number,
	color: string
): void {
	ctx.fillStyle = color;
	ctx.beginPath();

	ctx.moveTo(x + r, y);
	ctx.lineTo(x + w - r, y);
	ctx.quadraticCurveTo(x + w, y, x + w, y + r);
	ctx.lineTo(x + w, y + h - r);
	ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
	ctx.lineTo(x + r, y + h);
	ctx.quadraticCurveTo(x, y + h, x, y + h - r);
	ctx.lineTo(x, y + r);
	ctx.quadraticCurveTo(x, y, x + r, y);

	ctx.fill();

	ctx.fillStyle = "#606060";
	ctx.stroke();
}

function buttonPass(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number
): void {
	const r = 8;
	const w = 110;
	const h = 50;
	// button(ctx, x, y, r, w, h, "#FFAC4D");
	button(ctx, x, y, r, w, h, "#FF9030");
	ctx.fillStyle = "black";
	ctx.font = "30px garamond";
	ctx.fillText("Ignorer",x + w * 0.1, y + h/2 * 1.3);
}

function buttonPon(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number
): void {
	const r = 8;
	const w = 110;
	const h = 50;
	button(ctx, x, y, r, w, h, "#FFCC33");
	ctx.fillStyle = "black";
	ctx.font = "30px garamond";
	ctx.fillText("Pon",x + w * 0.28, y + h/2 * 1.3);
}

function buttonChii(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number
): void {
	const r = 8;
	const w = 110;
	const h = 50;
	button(ctx, x, y, r, w, h, "#FFCC33");
	ctx.fillStyle = "black";
	ctx.font = "30px garamond";
	ctx.fillText("Chii",x + w * 0.25, y + h/2 * 1.3);
}

function buttonKan(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number
): void {
	const r = 8;
	const w = 110;
	const h = 50;
	button(ctx, x, y, r, w, h, "#FFCC33");
	ctx.fillStyle = "black";
	ctx.font = "30px garamond";
	ctx.fillText("Kan",x + w * 0.28, y + h/2 * 1.3);
}

function buttonRon(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number
): void {
	const r = 8;
	const w = 110;
	const h = 50;
	button(ctx, x, y, r, w, h, "#FF3060");
	ctx.fillStyle = "black";
	ctx.font = "30px garamond";
	ctx.fillText("Ron",x + w * 0.28, y + h/2 * 1.3);
}

function buttonTsumo(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number
): void {
	const r = 8;
	const w = 110;
	const h = 50;
	button(ctx, x, y, r, w, h, "#FF3060");
	ctx.fillStyle = "black";
	ctx.font = "30px garamond";
	ctx.fillText("Tsumo",x + w * 0.13, y + h/2 * 1.3);
}
