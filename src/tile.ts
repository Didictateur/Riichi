export class Tile {
	private family: number;
	private value: number;
	private red: boolean;
	private imgSrc: string;
	private imgFront: HTMLImageElement;
	private imgBack: HTMLImageElement;
	private imgGray: HTMLImageElement;
	private img: HTMLImageElement;
	private tilt: number;
		
	public constructor(family: number, value: number	, red: boolean) {
		this.family = family;
		this.value = value;
		this.red = red;
		this.imgSrc = "";
		this.imgFront = new Image();
		this.imgBack = new Image();
		this.imgGray = new Image();
		this.img = new Image();
		this.tilt = 0;
		this.setImgSrc();
	}

	public getFamily(): number {
		return this.family;
	}

	public getValue(): number {
		return this.value;
	}

	public isEqual(family: number, value: number): boolean {
		return this.family === family && this.value === value;
	}

	public isRed(): boolean {
		return this.red;
	}

	public setTilt(): void {
		this.tilt = (1 - 2 * Math.random()) * 0.04;
	}

	public drawTile(
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		size: number,
		hidden: boolean = false,
		rotation: number = 0,
		gray: boolean = false
	): void {
		ctx.save();
		ctx.translate(x + (75 * size) / 2, y + (100 * size) / 2);
		ctx.rotate(rotation + this.tilt);

		if (hidden) {
			ctx.drawImage(
				this.imgBack,
				-(75 * size) / 2,
				-(100 * size) / 2,
				75 * size, 100 * size
			);
		} else {
			ctx.drawImage(
				this.imgFront,
				-(75 * size) / 2,
				-(100 * size) / 2,
				75 * size, 100 * size
			);
			ctx.drawImage(
				this.img,
				-(75 * size) / 2,
				-(100 * size) / 2,
				75 * size,
				100 * size
			);
			if (gray) {
				ctx.drawImage(
					this.imgGray,
					-(75 * size) / 2,
					-(100 * size) / 2,
					75 * size,
					100 * size
				);
			}
		}

		ctx.restore();
	}

	public isLessThan(t: Tile): boolean {
		if (this.family < t.family) {
			return true;
		} else if (this.family === t.family && this.value <= t.value) {
			return true;
		} else {
			return false;
		}
	}

	public cleanup(): void {
		this.imgFront.onload = null;
		this.imgFront.onerror = null;
		this.imgBack.onload = null;
		this.imgBack.onerror = null;
		this.imgGray.onload = null;
		this.imgGray.onerror = null;
		this.img.onload = null;
		this.img.onerror = null;
	}

	private setImgSrc(): void {
		this.imgSrc = "/img/Regular/"
		if (this.family <= 3) {
			this.imgSrc += ["", "Man", "Pin", "Sou"][this.family];
			this.imgSrc += String(this.value);
			if (this.red) {
				this.imgSrc += "-Dora";
			}
			this.imgSrc += ".svg";
		} else if (this.family === 4) {
			this.imgSrc += ["", "Ton", "Nan", "Shaa", "Pei"][this.value] + ".svg";
		} else if (this.family === 5) {
			this.imgSrc += ["", "Chun", "Hatsu", "Haku"][this.value] + ".svg";
		}
	}

	public async preloadImg(): Promise<void> {
		await Promise.all([
			this.loadImg(this.imgFront, "/img/Regular/Front.svg"),
			this.loadImg(this.imgBack, "/img/Regular/Back.svg"),
			this.loadImg(this.imgGray, "/img/Regular/Gray.svg"),
			this.loadImg(this.img, this.imgSrc)
		]);
	}

	private loadImg(img: HTMLImageElement, src: string): Promise<void> {
		return new Promise((resolve, reject) => {
			img.onload = () => resolve();
			img.onerror = () => reject();
			img.src = src;
		});
	}
}
