import { Tile } from "./tile"

export class Group {
	private tiles: Array<Tile>;
	private stolenFrom: number|undefined;

	public constructor(tiles: Array<Tile> = [], stolenFrom: number|undefined = undefined) {
		this.tiles = tiles;
		this.stolenFrom = stolenFrom;
	}

	public push(tile: Tile): void {
		this.tiles.push(tile);
	}

	public pop(): Tile|undefined {
		return this.tiles.pop();
	}

	public getTiles(): Array<Tile> {
		return this.tiles;
	}

	public drawGroup(
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		os: number,
		size: number,
		rotation: number,
	): void {
		let v = 75 * size;
		let w = 90 * size;
		let vx = Math.cos(rotation);
		let vy = Math.sin(rotation);
		let osx = Math.sin(rotation) * 25 * size / 2;
		let osy = Math.cos(rotation) * 25 * size / 2;
		if (!this.stolenFrom) {
			//TODO error
		}
		let p = 3 - (this.stolenFrom as NonNullable<number>);
		
		if (p === 0) {
			this.tiles[0].drawTile(
				ctx,
				x + osx,
				y + osy,
				size,
				false,
				3.141592 / 2,
				false
			);
			this.tiles[1].drawTile(
				ctx,
				x + vx * w,
				y + vy * w,
				size,
				false,
				0,
				false
			);
			this.tiles[2].drawTile(
				ctx,
				x + vx * (w + v + os * size),
				y + vy * (w + v + os * size),
				size,
				false,
				0,
				false
			);
		
		} else if (p === 1) {
			this.tiles[0].drawTile(
				ctx,
				x,
				y,
				size,
				false,
				0,
				false
			);
			this.tiles[1].drawTile(
				ctx,
				x + vx * w + osx,
				y + vy * w + osy,
				size,
				false,
				0 - 3.141592 / 2,
				false
			);
			this.tiles[2].drawTile(
				ctx,
				x + vx * (w + v + 3 *os * size),
				y + vy * (w + v + 3 *os * size),
				size,
				false,
				0,
				false
			);
		
		} else if (p === 2) {
			this.tiles[0].drawTile(
				ctx,
				x,
				y,
				size,
				false,
				0,
				false
			);
			this.tiles[1].drawTile(
				ctx,
				x + vx * (v + os * size),
				y + vy * (v + os * size),
				size,
				false,
				0,
				false
			);
			this.tiles[2].drawTile(
				ctx,
				x + vx * (w + v + os * size) + osx,
				y + vy * (w + v + os * size) + osy,
				size,
				false,
				0 - 3.141592 / 2,
				false
			);

		} else {
			//TODO error
		}
	}
}
