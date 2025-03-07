import { Tile } from "./tile"

export class Hand {
	private tiles: Array<Tile>;
	
	public constructor(stiles: string = "") {
		this.tiles = [];
		for (let i = 0; 2 * i + 1 < stiles.length; i++) {
			let ss = stiles.substring(2*i, 2*(i+1));
			if (ss[0] === "m") {
				this.tiles.push(new Tile(1, Number(ss[1]), false));
			} else if (ss[0] === "p") {
				this.tiles.push(new Tile(2, Number(ss[1]), false));
			} else if (ss[0] === "s") {
				this.tiles.push(new Tile(3, Number(ss[1]), false));
			} else if (ss[0] === "w") {
				this.tiles.push(new Tile(4, Number(ss[1]), false));
			} else if (ss[0] === "d") {
				this.tiles.push(new Tile(5, Number(ss[1]), false));
			} else {}
		}
	}

	public push(tile: Tile): undefined {
		this.tiles.push(tile);
	}

	public pop(): Tile|undefined {
		return this.tiles.pop();
	}

	public sort(): undefined {
		for (let i = 0; i < this.tiles.length; i++) {
			for (let j = 0; j < this.tiles.length-1; j++) {
				if (!this.tiles[j].isLessThan(this.tiles[j+1])) {
					[this.tiles[j], this.tiles[j+1]] = [this.tiles[j+1], this.tiles[j]];
				}
			}
		}
	}
	
	public drawHand (
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		offset: number,
		size: number,
		focusedTiled: number|undefined = undefined
	): void {	
		for (var i = 0; i < this.tiles.length; i++) {
			if (i === focusedTiled) {
				this.tiles[i].drawTile(
					ctx,
					x + i * 75 * size + i * offset * size,
					y - 25 * size,
					size
				);
			} else {
				this.tiles[i].drawTile(
					ctx,
					x + i * 75 * size + i * offset * size,
					y,
					size
				);
			}
		}
	}

	public async preload(): Promise<void> {
		for (let i = 0; i < this.tiles.length; i++) {
			await this.tiles[i].preloadImg();
		}
	}

	public cleanup(): void {
		this.tiles.forEach(tile => tile.cleanup());
		this.tiles = [];
	}
}
