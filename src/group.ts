import { Tile } from "./tile"

export class Group {
	private tiles: Array<Tile>;

	public constructor(tiles: Array<Tile> = []) {
		this.tiles = tiles;
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
}
