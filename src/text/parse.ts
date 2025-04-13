export async function drawText(
	filePath: string,
	ctx: CanvasRenderingContext2D,
): Promise<void> {
	console.log(filePath, "\n");
	const fileContent = await fetch(filePath)
		.then(response => response.text());
	const size = 30;
	const dl = 5;
	const ll = 20;
	const xx = 10;
	const defaultColor = "#ffffff";
	ctx.fillStyle = defaultColor;
	ctx.font = size + "px Garamond";

	let readingColor = false;
	let color = "";
	let gras = "";
	let italic = "";

	let line = 1;
	let x = 0;
	for (var c of fileContent) {
		if (c === '*') {
			if (gras === "") {
				gras = "bold ";
			} else {
				gras = "";
			}
			ctx.font = italic + gras + size + "px Garamond";
		} else if (c === '~') {
			if (italic === "") {
				italic = "italic ";
			} else {
				italic = "";
			}
			ctx.font = italic + gras + size + "px Garamond";
		} else if (c === '#') {
			color = "#";
			readingColor = true;
		} else if (c === '{') {
			readingColor = false;
			ctx.fillStyle = color;
		} else if (c === '}') {
			color = "";
			ctx.fillStyle = defaultColor;
		} else if (readingColor) {
			color += c;
		} else if (c === '\n') {
			line++;
			x = 0;
		} else {
			ctx.fillText(c, xx + x, ll + line * (size + dl));
			x += ctx.measureText(c).width;
		}
	}
}
