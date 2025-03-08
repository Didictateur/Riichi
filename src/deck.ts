import { Tile } from "./tile"
import { Hand } from "./hand"

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
	): void {
		let posX = x;
		let posY = y;
		for (let i = 1; i < 6; i++) {
			if (i < 4) { // famille
				for (let j = 1; j < 10; j++) {
					const tile = this.find(i, j) as NonNullable<Tile>;
					tile.drawTile(ctx, posX, posY, size);
					posX += (75 + xOffset) * size;
				}
				posX = x;
				posY += (100 + yOffset) * size;
			} else if (i === 4) { //vent
				for (let j = 1; j < 5; j++) {
					const tile = this.find(i, j) as NonNullable<Tile>;
					tile.drawTile(ctx, posX, posY, size);
					posX += (75 + xOffset) * size;
				}
				posX = x;
				posY += (100 + yOffset) * size;
			} else if (i === 5) { //vent
				for (let j = 1; j < 4; j++) {
					const tile = this.find(i, j) as NonNullable<Tile>;
					tile.drawTile(ctx, posX, posY, size);
					posX += (75 + xOffset) * size;
				}
			}
		}
	}

	public length(): number {
		return this.tiles.length;
	}

	public pop(): Tile {
		if (this.tiles.length === 0) {
		}
		return this.tiles.pop() as NonNullable<Tile>;
	}

	public push(tile: Tile) {
		this.tiles.push(tile);
	}

	public find(family: number, value: number): Tile | undefined {
		let n = undefined;
		for (let i = 0; i < this.tiles.length; i++) {
			if (
				this.tiles[i].getFamily() === family &&
				this.tiles[i].getValue() === value
			) {
				n = i;
			}
		}
		if (n !== undefined) {
			[this.tiles[n as NonNullable<number>], this.tiles[0]] = [this.tiles[0], this.tiles[n as NonNullable<number>]];
			return this.tiles.shift();
		} else {
			return undefined;
		}
	}

	public count(family: number, value: number): number {
		let n = 0;
		for (let i = 0; i < this.tiles.length; i++) {
			if (
				this.tiles[i].getFamily() === family &&
				this.tiles[i].getValue() === value
			) {
				n++;
			}
		}
		return n;
	}

	public shuffle(): undefined {
		let newArray: Array<Tile> = [];
		while (this.tiles.length > 0) {
			let n = Math.floor(Math.random() * this.tiles.length);
			[this.tiles[n], this.tiles[0]] = [this.tiles[0], this.tiles[n]];
			newArray.push(this.tiles.shift() as NonNullable<Tile>);
		}
		this.tiles = newArray;
	}

	public getRandomHand(): Hand {
		let hand = new Hand();
		this.shuffle();
		for (let i = 0; i < 13; i++) {
			hand.push(this.pop());
		}
		return hand;
	}

	public cleanup(): void {
		this.tiles.forEach(tile => tile.cleanup());
		this.tiles = [];
	}

	public async preload(): Promise<void> {
		for (let i = 0; i < this.tiles.length; i++) {
			await this.tiles[i].preloadImg();
		}
	}

	private initTiles(allowRed: boolean): undefined {
		for (let i = 1; i < 6; i++) {
			if (i < 4) { // famille
				for (let j = 1; j < 10; j++) {
					this.tiles.push(new Tile(i, j, false));
					this.tiles.push(new Tile(i, j, false));
					this.tiles.push(new Tile(i, j, false));
					if (j === 5 && allowRed) {
						this.tiles.push(new Tile(i, j, true));
					} else {
						this.tiles.push(new Tile(i, j, false));
					}
				}
			} else if (i === 4) { // vent
				for (let j = 1; j < 5; j++) {
					for (let k = 0; k < 4; k++) {
						this.tiles.push(new Tile(i, j, false));
					}
				}
			} else if (i === 5) { // dragon
				for (let j = 1; j < 4; j++) {
					for (let k = 0; k < 4; k++) {
						this.tiles.push(new Tile(i, j, false));
					}
				}
			}
		}
	}
}
