import { Tile } from "./tile"
import { Group } from "./group"

export class Hand {
	private tiles: Array<Tile>;
	public isolate: boolean = false;
	
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

	public length(): number {
		return this.tiles.length;
	}

	public push(tile: Tile): void {
		this.tiles.push(tile);
	}

	public pop(): Tile|undefined {
		return this.tiles.pop();
	}

	public find(family: number, value: number) :Tile|undefined {
		let n = undefined;
		for (let i = 0; i < this.tiles.length; i++) {
			if (this.tiles[i].getFamily() === family && this.tiles[i].getValue() === value) {
				n = i;
				break;
			}
		}
		if (n !== undefined) {
			[this.tiles[n], this.tiles[0]] = [this.tiles[0], this.tiles[n]];
			let t = this.tiles.shift();
			this.sort();
			return t;
		} else {
			return undefined;
		}
	}

	public eject(idTile: number): Tile {
		[this.tiles[0], this.tiles[idTile]] = [this.tiles[idTile], this.tiles[0]];
		let tile = this.tiles.shift();
		this.sort();
		return tile as NonNullable<Tile>;
	}

	public get(idTile: number|undefined): Tile|undefined {
		if (idTile !== undefined) {
			return this.tiles[idTile];
		} else {
			return undefined;
		}
	}

	public sort(): undefined {
		this.tiles.sort((a, b) => a.isLessThan(b) ? -1 : 1);
	}

	public count(family: number, value: number): number {
		let c = 0;
		this.tiles.forEach(
			t => {
				if (t.getFamily() === family && t.getValue() === value) {
					c++;
				}
			}
		);
		return c;
	}

	public toGroup(pair: boolean = false): Array<Group>|undefined {
		if (this.tiles.length > 0) {
			let t1 = this.tiles.pop() as NonNullable<Tile>;
			
			let c = this.count(t1.getFamily(), t1.getValue());
			if (c >= 1 && !pair) { //can do a pair
				let t2 = this.find(t1.getFamily(), t1.getValue()) as NonNullable<Tile>;
				let groups = this.toGroup(true);
				this.tiles.push(t2);
				this.sort();
				if (groups !== undefined) {
					this.tiles.push(t1);
					this.sort();
					groups.push(new Group([t1, t2]));
					return groups;
				}
			}
			if (c >= 2) { //can do a pon
				let t2 = this.find(t1.getFamily(), t1.getValue()) as NonNullable<Tile>;
				let t3 = this.find(t1.getFamily(), t1.getValue()) as NonNullable<Tile>;
				let groups = this.toGroup(pair);
				this.tiles.push(t2);
				this.tiles.push(t3);
				this.sort();
				if (groups !== undefined) {
					groups.push(new Group([t1, t2, t3]));
					this.tiles.push(t1);
					this.sort();
					return groups;
				}
			}
			
			let c2 = this.count(t1.getFamily(), t1.getValue()-1);
			let c3 = this.count(t1.getFamily(), t1.getValue()-2);
			if (c2 * c3 > 0) { //can do a chii
				let t2 = this.find(t1.getFamily(), t1.getValue()-1) as NonNullable<Tile>;
				let t3 = this.find(t1.getFamily(), t1.getValue()-2) as NonNullable<Tile>;
				let groups = this.toGroup(pair);
				this.tiles.push(t2);
				this.tiles.push(t3);
				this.sort();
				if (groups !== undefined) {
					groups.push(new Group([t3, t2, t1]));
					this.tiles.push(t1);
					this.sort();
					return groups;
				}
			}

			this.tiles.push(t1);
			this.tiles.sort();

		} else {
			return [];
		}
		return undefined
	}
	
	public drawHand (
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		offset: number,
		size: number,
		focusedTiled: number|undefined = undefined,
		hidden: boolean = false,
		rotation: number = 0
	): void {
		let v = (75 + offset) * size;
		let vx = Math.cos(rotation) * v;
		let vy = Math.sin(rotation) * v;
		for (let i = 0; i < this.tiles.length; i++) {
			let e = (i === this.tiles.length - 1 && this.isolate) ? 10 : 0;
			if (i === focusedTiled) {
				this.tiles[i].drawTile(
					ctx,
					x +
						i * vx +
						25 * size * Math.sin(rotation) +
						e * size * Math.cos(rotation),
					y +
						i * vy -
						25 * size * Math.cos(rotation) +
						e * size * Math.sin(rotation),
					size,
					hidden,
					rotation
				);
			} else {
				this.tiles[i].drawTile(
					ctx,
					x + i * vx + e * size * Math.cos(rotation),
					y + i * vy + e * size * Math.sin(rotation),
					size,
					hidden,
					rotation
				);
			}
		}
	}

	public async preload(): Promise<void> {
		await Promise.all(this.tiles.map(t => t.preloadImg()));
	}

	public cleanup(): void {
		this.tiles.forEach(tile => tile.cleanup());
		this.tiles = [];
	}
}
