import { Tile } from "./tile"

export class Group {
	private tiles: Array<Tile>;
	private stolenFrom: number;
	private belongsTo: number

	public constructor(
		tiles: Array<Tile>,
		stolenFrom: number,
		belongsTo: number
	) {
		this.tiles = tiles;
		this.stolenFrom = stolenFrom;
		this.belongsTo = belongsTo;
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

	public compare(g: Group): number {
		let c = this.tiles[0].compare(g.tiles[0]);
		if (c !== 0) {
			return c;
		}
		return this.tiles[1].compare(g.tiles[1]);
	} 

	public drawGroup(
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		os: number,
		size: number,
		rotation: number,
		selectedTile: Tile|undefined
	): void {
		ctx.save();
		ctx.translate(525, 525);
		ctx.rotate(rotation);
		ctx.translate(-525, -525);
		
		rotation = 0;
		let v = 75 * size;
		let w = 90 * size;
		let osy = 25 * size / 2;
		let p = (this.belongsTo - this.stolenFrom - 1 + 4) % 4;

		const sf = selectedTile === undefined ? -1 : selectedTile.getFamily();
		const sv = selectedTile === undefined ? 0 : selectedTile.getValue();

		if (p === 0) {
			this.tiles[0].drawTile(
				ctx,
				x,
				y + osy,
				size,
				false,
				3.141592 / 2,
				this.tiles[0].isEqual(sf, sv),
			);
			this.tiles[1].drawTile(
				ctx,
				x + w,
				y,
				size,
				false,
				0,
				this.tiles[1].isEqual(sf, sv),
			);
			this.tiles[2].drawTile(
				ctx,
				x + w + v + os * size,
				y,
				size,
				false,
				0,
				this.tiles[2].isEqual(sf, sv),
			);
		
		} else if (p === 1) {
			this.tiles[0].drawTile(
				ctx,
				x,
				y,
				size,
				false,
				0,
				this.tiles[0].isEqual(sf, sv),
			);
			this.tiles[1].drawTile(
				ctx,
				x + w,
				y + osy,
				size,
				false,
				0 - 3.141592 / 2,
				this.tiles[1].isEqual(sf, sv),
			);
			this.tiles[2].drawTile(
				ctx,
				x + w + v + 3 *os * size,
				y,
				size,
				false,
				0,
				this.tiles[2].isEqual(sf, sv),
			);
		
		} else if (p === 2) {
			this.tiles[0].drawTile(
				ctx,
				x,
				y,
				size,
				false,
				0,
				this.tiles[0].isEqual(sf, sv),
			);
			this.tiles[1].drawTile(
				ctx,
				x + v + os * size,
				y,
				size,
				false,
				0,
				this.tiles[1].isEqual(sf, sv),
			);
			this.tiles[2].drawTile(
				ctx,
				x + w + v + os * size,
				y + osy,
				size,
				false,
				0 - 3.141592 / 2,
				this.tiles[2].isEqual(sf, sv),
			);

		} else {
			//TODO error
		}

		ctx.restore();
	}
}
