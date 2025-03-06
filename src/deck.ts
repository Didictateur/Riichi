import { Tile } from "./tile"

export class Deck {
	private tiles: Array<Tile>;

	public constructor(allowRed: boolean) {
		this.tiles = [];
		this.initTiles(allowRed);
	}

	public displayFamilies(
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		size: number,
		xOffset: number = 0,
		yOffset: number = 0
	): undefined {
		let posX = x;
		let posY = y;
		for (let i = 1; i < 6; i++) {
			if (i < 4) { // ordinaire
				for (let j = 1; j < 10; j++) {
					const tile = new Tile(i, j, false);
					tile.drawTile(ctx, posX, posY, size);
					posX += (75 + xOffset) * size;
				}
				posX = x;
				posY += (100 + yOffset) * size;
			} else if (i === 4) { //vent
				for (let j = 1; j < 5; j++) {
					const tile = new Tile(i, j, false);
					tile.drawTile(ctx, posX, posY, size);
					posX += (75 + xOffset) * size;
				}
				posX = x;
				posY += (100 + yOffset) * size;
			} else if (i === 5) { //vent
				for (let j = 1; j < 4; j++) {
					const tile = new Tile(i, j, false);
					tile.drawTile(ctx, posX, posY, size);
					posX += (75 + xOffset) * size;
				}
			}
		}
	}

	private initTiles(allowRed: boolean): undefined {
		for (let i = 1; i < 6; i++) {
			if (i < 4) { // ordinaire
				for (let j = 1; i < 10; i++) {
					this.tiles.push(new Tile(i, j, false));
					this.tiles.push(new Tile(i, j, false));
					this.tiles.push(new Tile(i, j, false));
					if (j === 5 && allowRed) {
						this.tiles.push(new Tile(i, j, true));
					} else {
						this.tiles.push(new Tile(i, j, false));
					}
				}
			} else if (i === 5) { //vent
				for (let j = 1; j < 5; j++) {
					for (let k = 0; k < 4; k++) {
						this.tiles.push(new Tile(i, j, false));
					}
				}
			} else if (i === 6) { //vent
				for (let j = 1; j < 4; j++) {
					for (let k = 0; k < 4; k++) {
						this.tiles.push(new Tile(i, j, false));
					}
				}
			}
		}
	}
}
