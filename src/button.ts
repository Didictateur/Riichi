import { Tile } from "./tile"

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
		[tsumo, 5],
		[ron, 4],
		[kan, 3],
		[pon, 2],
		[chii, 1]
	]
	if (buttons.some(c => c[0])) {
		buttons.push([true, 0]);
	} else {
		return -1;
	}
	let xmin = 960 - buttons.filter(c => c[0]).length * 120;
	let inside = 838 < y && y < 888;
	let q = Math.floor((x - xmin) / 120);
	let r = (x - xmin) - 120 * q;
	if (
		q >= 0 &&
		q < buttons.filter(c => c[0]).length &&
		r > 10 &&
		inside
	) {
		return buttons.filter(c => c[0])[q][1] as number;
	}
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

export function clickChii(
	x: number,
	y: number,
	chiis: Array<Array<Tile>>
): number {
	let xmin = 960 - (chiis.length + 1) * 120;
	let inside = 838 < y && y < 888;
	let q = Math.floor((x - xmin) / 120);
	let r = (x - xmin) - 120 * q;
	if (
		q >= 0 &&
		q < (chiis.length + 1) &&
		r > 10 &&
		inside
	) {
		return q === chiis.length ? 0 : chiis[q][0].getValue();
	}
	return -1;
}

export function drawChiis(
	ctx: CanvasRenderingContext2D,
	chiis: Array<Array<Tile>>
): void {
	chiis.reverse();
	const r = 8;
	const w = 110;
	const h = 50;
	button(ctx, 850, 835, r, w, h, "#FF9030");
	ctx.fillStyle = "black";
	ctx.font = "30px garamond";
	ctx.fillText("Retour", 850 + w * 0.1, 835 + h/2 * 1.3);
	
	let dx = 1;
	for (let i = 0; i < chiis.length; i++) {
		drawOneChii(
			ctx,
			850 - dx * 120,
			835,
			chiis[i]
		);
		dx++;
	}
}

function drawOneChii(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	tiles: Array<Tile>
): void {
	const r = 8;
	const w = 110;
	const h = 50;
	const dx = 32;
	const x0 = x + 7;
	const y0 = y + 5;
	button(ctx, x, y, r, w, h, "#FFCC33");
	tiles[0].drawTile(
		ctx,
		x0,
		y0,
		0.4,
		false,
		0,
		false,
		false
	);
	tiles[1].drawTile(
		ctx,
		x0 + dx,
		y0,
		0.4,
		false,
		0,
		false,
		false
	);
	tiles[2].drawTile(
		ctx,
		x0 + 2 * dx,
		y0,
		0.4,
		false,
		0,
		false,
		false
	);
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
	ctx.fillText("Ignorer", x + w * 0.1, y + h/2 * 1.3);
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
