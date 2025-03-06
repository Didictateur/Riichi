import { Tile } from "./tile"

export class hand {
	private tiles: Array<Tile>;
	
	public constructor(tiles: Array<Tile> = []) {
		this.tiles = tiles;
	}

	public push(tile: Tile): undefined {
		this.tiles.push(tile);
	}

	public pop(): Tile|undefined {
		return this.tiles.pop();
	}		
}
