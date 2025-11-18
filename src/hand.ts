import { Tile } from "./tile";
import { Group } from "./group";

// Constants to avoid magic numbers and improve readability
const TILE_TYPES = {
  MANZU: { code: "m", family: 1 },
  PINZU: { code: "p", family: 2 },
  SOUZU: { code: "s", family: 3 },
  WINDS: { code: "w", family: 4 },
  DRAGONS: { code: "d", family: 5 }
};

// Helper class for grouping operations
class GroupFinder {
  private tiles: Array<Tile>;
  
  constructor(tiles: Array<Tile>) {
    // Create deep copies of the tiles to avoid modifying originals
    this.tiles = tiles.map(t => new Tile(t.getFamily(), t.getValue(), t.isRed()));
    this.sort();
  }
  
  public sort(): void {
    this.tiles.sort((a, b) => a.isLessThan(b) ? -1 : 1);
  }
  
  public find(family: number, value: number): Tile | undefined {
    const index = this.findTileIndex(family, value);
    
    if (index !== -1) {
      [this.tiles[index], this.tiles[0]] = [this.tiles[0], this.tiles[index]];
      const tile = this.tiles.shift();
      this.sort();
      return tile;
    }
    
    return undefined;
  }
  
  private findTileIndex(family: number, value: number): number {
    return this.tiles.findIndex(
      tile => tile.getFamily() === family && tile.getValue() === value
    );
  }
  
  public count(family: number, value: number): number {
    return this.tiles.filter(
      tile => tile.getFamily() === family && tile.getValue() === value
    ).length;
  }
  
  // Find groups recursively without modifying original tiles
  public findGroups(pair: boolean = false): Array<Group> | undefined {
    if (this.tiles.length === 0) {
      return [];
    }
    
    // Take last tile to try forming a group
    const lastTile = this.tiles.pop() as Tile;
    const family = lastTile.getFamily();
    const value = lastTile.getValue();
    
    // Try to form a pair
    if (this.count(family, value) >= 1 && !pair) {
      const result = this.tryFormPair(lastTile);
      if (result) return result;
    }
    
    // Try to form a triplet (pon)
    if (this.count(family, value) >= 2) {
      const result = this.tryFormTriplet(lastTile, pair);
      if (result) return result;
    }
    
    // Try to form a sequence (chii)
    if (family <= 3) { // Only suit tiles can form sequences
      const hasMinusOne = this.count(family, value - 1) > 0;
      const hasMinusTwo = this.count(family, value - 2) > 0;
      
      if (hasMinusOne && hasMinusTwo) {
        const result = this.tryFormSequence(lastTile, pair);
        if (result) return result;
      }
    }
    
    // If no valid group could be formed, put tile back and return undefined
    this.tiles.push(lastTile);
    this.sort();
    return undefined;
  }
  
  private tryFormPair(tile: Tile): Array<Group> | undefined {
    const pairTile = this.find(tile.getFamily(), tile.getValue()) as Tile;
    const groups = this.findGroups(true);
    
    // Put the tile back
    this.tiles.push(pairTile);
    this.sort();
    
    if (groups !== undefined) {
      this.tiles.push(tile);
      this.sort();
      groups.push(new Group([tile, pairTile], 0, 0));
      return groups;
    }
    
    return undefined;
  }
  
  private tryFormTriplet(tile: Tile, pair: boolean): Array<Group> | undefined {
    const secondTile = this.find(tile.getFamily(), tile.getValue()) as Tile;
    const thirdTile = this.find(tile.getFamily(), tile.getValue()) as Tile;
    
    const groups = this.findGroups(pair);
    
    // Put tiles back
    this.tiles.push(secondTile);
    this.tiles.push(thirdTile);
    this.sort();
    
    if (groups !== undefined) {
      groups.push(new Group([tile, secondTile, thirdTile], 0, 0));
      this.tiles.push(tile);
      this.sort();
      return groups;
    }
    
    return undefined;
  }
  
  private tryFormSequence(tile: Tile, pair: boolean): Array<Group> | undefined {
    const secondTile = this.find(tile.getFamily(), tile.getValue() - 1) as Tile;
    const thirdTile = this.find(tile.getFamily(), tile.getValue() - 2) as Tile;
    
    const groups = this.findGroups(pair);
    
    // Put tiles back
    this.tiles.push(secondTile);
    this.tiles.push(thirdTile);
    this.sort();
    
    if (groups !== undefined) {
      groups.push(new Group([thirdTile, secondTile, tile], 0, 0));
      this.tiles.push(tile);
      this.sort();
      return groups;
    }
    
    return undefined;
  }
}

export class Hand {
  private tiles: Array<Tile>;
  public isolate: boolean = false;
  
  /**
   * Create a hand from string representation
   * @param stiles String representation of tiles (e.g., "m1p2s3w1d1")
   */
  public constructor(stiles: string = "") {
    this.tiles = [];
    this.initializeFromString(stiles);
  }

  /**
   * Parse string representation into tiles
   */
  private initializeFromString(stiles: string): void {
    for (let i = 0; i < stiles.length - 1; i++) {
      const tileCode = stiles.substring(i, i + 2);
      const type = tileCode[0];
      const value = Number(tileCode[1]);
      
      if (this.isValidTileCode(type, value)) {
        this.addTileFromCode(type, value);
      }
    }
  }

  /**
   * Check if tile code is valid
   */
  private isValidTileCode(type: string, value: number): boolean {
    return (
      (type === TILE_TYPES.MANZU.code) ||
      (type === TILE_TYPES.PINZU.code) ||
      (type === TILE_TYPES.SOUZU.code) ||
      (type === TILE_TYPES.WINDS.code) ||
      (type === TILE_TYPES.DRAGONS.code)
    );
  }

  /**
   * Create a tile from type code and value
   */
  private addTileFromCode(type: string, value: number): void {
    const familyMap: { [key: string]: number } = {
      [TILE_TYPES.MANZU.code]: TILE_TYPES.MANZU.family,
      [TILE_TYPES.PINZU.code]: TILE_TYPES.PINZU.family,
      [TILE_TYPES.SOUZU.code]: TILE_TYPES.SOUZU.family,
      [TILE_TYPES.WINDS.code]: TILE_TYPES.WINDS.family,
      [TILE_TYPES.DRAGONS.code]: TILE_TYPES.DRAGONS.family
    };

    const family = familyMap[type];
    if (family !== undefined) {
      this.tiles.push(new Tile(family, value, false));
    }
  }

  /**
   * Get all tiles in hand
   */
  public getTiles(): Array<Tile> {
    return this.tiles;
  }

  /**
   * Get number of tiles in hand
   */
  public length(): number {
    return this.tiles.length;
  }

  /**
   * Add a tile to hand
   */
  public push(tile: Tile): void {
    this.tiles.push(tile);
  }

  /**
   * Remove and return the last tile
   */
  public pop(): Tile | undefined {
    return this.tiles.pop();
  }

  /**
   * Find and remove a specific tile by family and value
   */
  public find(family: number, value: number): Tile | undefined {
    const index = this.findTileIndex(family, value);
    
    if (index !== -1) {
      // Swap with first tile and remove
      [this.tiles[index], this.tiles[0]] = [this.tiles[0], this.tiles[index]];
      const tile = this.tiles.shift();
      this.sort();
      return tile;
    }
    
    return undefined;
  }

  /**
   * Find index of tile with specific family and value
   */
  private findTileIndex(family: number, value: number): number {
    return this.tiles.findIndex(
      tile => tile.getFamily() === family && tile.getValue() === value
    );
  }

  /**
   * Remove tile at specific index
   */
  public eject(idTile: number): Tile {
    if (idTile < 0 || idTile >= this.tiles.length) {
      throw new Error("Invalid tile index");
    }
    
    // Swap with first tile and remove
    [this.tiles[0], this.tiles[idTile]] = [this.tiles[idTile], this.tiles[0]];
    const tile = this.tiles.shift();
    this.sort();
    
    return tile as Tile;
  }

  /**
   * Get tile at specific index without removing
   */
  public get(idTile: number | undefined): Tile | undefined {
    if (idTile === undefined || idTile < 0 || idTile >= this.tiles.length) {
      return undefined;
    }
    
    return this.tiles[idTile];
  }

  /**
   * Sort tiles in ascending order
   */
  public sort(): void {
    this.tiles.sort((a, b) => a.isLessThan(b) ? -1 : 1);
  }

  /**
   * Count tiles with specific family and value
   */
  public count(family: number, value: number): number {
    return this.tiles.filter(
      tile => tile.getFamily() === family && tile.getValue() === value
    ).length;
  }

  /**
   * Try to form hand into groups (for winning detection)
   * This version preserves the original hand
   */
  public toGroup(pair: boolean = false): Array<Group> | undefined {
    // Create a helper instance with copied tiles
    const groupFinder = new GroupFinder(this.tiles);
    return groupFinder.findGroups(pair);
  }
  
  /**
   * Draw hand tiles on canvas
   */
  public drawHand(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    offset: number,
    size: number,
    focusedTile: number | undefined = undefined,
    hidden: boolean = false,
    rotation: number = 0,
    // If provided, skip drawing this tile index (useful when the focused
    // tile is rendered on a dynamic overlay to avoid seeing the unshifted
    // tile under the lifted one).
    skipIndex?: number
  ): void {
    const tileOffset = (75 + offset) * size;
    const offsetX = Math.cos(rotation) * tileOffset;
    const offsetY = Math.sin(rotation) * tileOffset;
    
    for (let i = 0; i < this.tiles.length; i++) {
      // Optionally skip drawing a specific tile (prevents ghosting when the
      // focused tile is drawn separately in a dynamic overlay).
      if (skipIndex !== undefined && i === skipIndex) continue;
      const isLastAndIsolated = (i === this.tiles.length - 1 && this.isolate) ? 10 : 0;
      
      // Calculate position
      let tileX = x + i * offsetX + isLastAndIsolated * size * Math.cos(rotation);
      let tileY = y + i * offsetY + isLastAndIsolated * size * Math.sin(rotation);
      
      // Add additional offset for focused tile
      if (i === focusedTile) {
        tileX += 25 * size * Math.sin(rotation);
        tileY -= 25 * size * Math.cos(rotation);
      }
      
      // Draw tile
      this.tiles[i].drawTile(
        ctx,
        tileX,
        tileY,
        size,
        hidden,
        rotation
      );
    }
  }

  /**
   * Preload tile images
   */
  public async preload(): Promise<void> {
    await Promise.all(this.tiles.map(tile => tile.preloadImg()));
  }

  /**
   * Clean up resources
   */
  public cleanup(): void {
    this.tiles.forEach(tile => tile.cleanup());
    this.tiles = [];
  }
}
