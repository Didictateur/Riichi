export class Tile {
	private family: number;
	private value: number;
	private red: boolean;
	private imgSrc: string;
		
	public constructor(family: number, value: number	, red: boolean) {
		this.family = family;
		this.value = value;
		this.red = red;
		this.imgSrc = "";
		this.setImgSrc();
	}

	public getFamily(): number {
		return this.family;
	}

	public getValue(): number {
		return this.value;
	}

	public isRed(): boolean {
		return this.red;
	}

	public drawTile(
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		size: number
	): undefined {
		const imgFront = new Image();
		imgFront.src = "/img/Regular/Front.svg";
		imgFront.onload = () => {
			ctx.drawImage(imgFront, x, y, 75 * size, 100 * size);
		};
		
		const img = new Image();
		img.src = this.imgSrc;
		img.onload = () => {
			ctx.drawImage(img, x, y, 75 * size, 100 * size);
		};
	}

	private setImgSrc(): undefined {
		this.imgSrc = "/img/Regular/"
		if (this.family <= 3) {
			this.imgSrc += ["", "Man", "Pin", "Sou"][this.family];
			this.imgSrc += String(this.value) + ".svg";
		} else if (this.family === 4) {
			this.imgSrc += ["", "Ton", "Nan", "Shaa", "Pei"][this.value] + ".svg";
		}
	}
}
