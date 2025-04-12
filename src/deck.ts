import { Tile } from "./tile";
import { Hand } from "./hand";

type TileKey = `${number}-${number}`;

export class Deck {
  private tiles: Tile[];
  private tileIndexMap: Map<TileKey, number[]>; // Fast lookup for find() and count()

  public constructor(allowRed: boolean = false) {
    this.tiles = [];
    this.tileIndexMap = new Map();
    this.initTiles(allowRed);
  }

  /**
   * Displays all tile families on the canvas
   */
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
    
    // Define tile layouts for each family
    const familyLayouts = [
      { family: 1, start: 1, end: 9 }, // First suit
      { family: 2, start: 1, end: 9 }, // Second suit
      { family: 3, start: 1, end: 9 }, // Third suit
      { family: 4, start: 1, end: 4 }, // Winds
      { family: 5, start: 1, end: 3 }  // Dragons
    ];

    for (const layout of familyLayouts) {
      for (let j = layout.start; j <= layout.end; j++) {
        const tile = this.find(layout.family, j);
        if (tile) {
          tile.drawTile(ctx, posX, posY, size, false, 0, false);
          posX += (75 + xOffset) * size;
        }
      }
      posX = x;
      posY += (100 + yOffset) * size;
    }
  }

  /**
   * Returns the number of tiles in the deck
   */
  public length(): number {
    return this.tiles.length;
  }

  /**
   * Removes and returns the last tile from the deck
   * @throws Error if the deck is empty
   */
  public pop(): Tile {
    if (this.tiles.length === 0) {
      throw new Error("Cannot pop from an empty deck");
    }
    
    const tile = this.tiles.pop()!;
    // Update the index map
    const key = this.getTileKey(tile.getFamily(), tile.getValue());
    const indices = this.tileIndexMap.get(key);
    
    if (indices && indices.length > 0) {
      indices.pop(); // Remove the last index
      if (indices.length === 0) {
        this.tileIndexMap.delete(key);
      } else {
        this.tileIndexMap.set(key, indices);
      }
    }
    
    return tile;
  }

  /**
   * Adds a tile to the deck
   */
  public push(tile: Tile): void {
    const index = this.tiles.length;
    this.tiles.push(tile);
    
    // Update the index map
    const key = this.getTileKey(tile.getFamily(), tile.getValue());
    const indices = this.tileIndexMap.get(key) || [];
    indices.push(index);
    this.tileIndexMap.set(key, indices);
  }

  /**
   * Finds and removes a specific tile from the deck
   */
  public find(family: number, value: number): Tile | undefined {
    const key = this.getTileKey(family, value);
    const indices = this.tileIndexMap.get(key);
    
    if (!indices || indices.length === 0) {
      return undefined;
    }
    
    // Get the first occurrence
    const index = indices[0];
    if (index >= this.tiles.length) {
      // Handle potential out-of-sync errors
      this.rebuildIndexMap();
      return this.find(family, value);
    }
    
    // Swap with the first element for efficient removal
    [this.tiles[index], this.tiles[0]] = [this.tiles[0], this.tiles[index]];
    
    // Update indices in the map
    this.updateIndicesAfterSwap(0, index);
    
    // Remove and return the tile
    const tile = this.tiles.shift();
    
    // Update all indices after shift
    this.decrementIndicesAfterShift();
    
    return tile;
  }

  /**
   * Counts the number of tiles with specific family and value
   */
  public count(family: number, value: number): number {
    const key = this.getTileKey(family, value);
    const indices = this.tileIndexMap.get(key);
    return indices ? indices.length : 0;
  }

  /**
   * Shuffles the deck using Fisher-Yates algorithm
   */
  public shuffle(): void {
    // Fisher-Yates shuffle algorithm
    for (let i = this.tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.tiles[i], this.tiles[j]] = [this.tiles[j], this.tiles[i]];
    }
    
    // Rebuild the index map after shuffling
    this.rebuildIndexMap();
  }

  /**
   * Creates a random hand from the deck
   */
  public getRandomHand(): Hand {
    const hand = new Hand();
    this.shuffle();
    
    // Handle case where deck doesn't have enough tiles
    if (this.tiles.length < 13) {
      throw new Error("Not enough tiles in deck to create a hand");
    }
    
    for (let i = 0; i < 13; i++) {
      hand.push(this.pop());
    }
    
    return hand;
  }

  /**
   * Cleans up resources used by tiles and empties the deck
   */
  public cleanup(): void {
    this.tiles.forEach(tile => tile.cleanup());
    this.tiles = [];
    this.tileIndexMap.clear();
  }

  /**
   * Preloads all tile images
   */
  public async preload(): Promise<void> {
    const preloadPromises = this.tiles.map(tile => tile.preloadImg());
    await Promise.all(preloadPromises);
  }

  /**
   * Creates a unique key for each tile type
   */
  private getTileKey(family: number, value: number): TileKey {
    return `${family}-${value}`;
  }

  /**
   * Updates the index map after swapping two tiles
   */
  private updateIndicesAfterSwap(index1: number, index2: number): void {
    if (index1 === index2) return;
    
    const tile1 = this.tiles[index1];
    const tile2 = this.tiles[index2];
    
    const key1 = this.getTileKey(tile1.getFamily(), tile1.getValue());
    const key2 = this.getTileKey(tile2.getFamily(), tile2.getValue());
    
    const indices1 = this.tileIndexMap.get(key1) || [];
    const indices2 = this.tileIndexMap.get(key2) || [];
    
    // Update indices
    const idx1 = indices1.indexOf(index2);
    const idx2 = indices2.indexOf(index1);
    
    if (idx1 !== -1) indices1[idx1] = index1;
    if (idx2 !== -1) indices2[idx2] = index2;
    
    this.tileIndexMap.set(key1, indices1);
    this.tileIndexMap.set(key2, indices2);
  }

  /**
   * Decrements all indices after a shift operation
   */
  private decrementIndicesAfterShift(): void {
    for (const [key, indices] of this.tileIndexMap.entries()) {
      this.tileIndexMap.set(
        key,
        indices
          .filter(idx => idx !== 0) // Remove the index 0 that was shifted
          .map(idx => (idx > 0 ? idx - 1 : idx)) // Decrement all indices
      );
      
      // Clean up empty entries
      if (this.tileIndexMap.get(key)?.length === 0) {
        this.tileIndexMap.delete(key);
      }
    }
  }

  /**
   * Rebuilds the entire index map from scratch
   */
  private rebuildIndexMap(): void {
    this.tileIndexMap.clear();
    
    for (let i = 0; i < this.tiles.length; i++) {
      const tile = this.tiles[i];
      const key = this.getTileKey(tile.getFamily(), tile.getValue());
      const indices = this.tileIndexMap.get(key) || [];
      indices.push(i);
      this.tileIndexMap.set(key, indices);
    }
  }

  /**
   * Initializes the deck with all tiles
   */
  private initTiles(allowRed: boolean): void {
    // Create suits (families 1-3)
    for (let family = 1; family <= 3; family++) {
      for (let value = 1; value <= 9; value++) {
        // Each value appears 4 times in a suit
        const isRedFive = value === 5 && allowRed;
        
        // Add 3 regular tiles
        for (let i = 0; i < 3; i++) {
          this.push(new Tile(family, value, false));
        }
        
        // Add the 4th tile (potentially red five)
        this.push(new Tile(family, value, isRedFive));
      }
    }
    
    // Create winds (family 4)
    for (let value = 1; value <= 4; value++) {
      for (let i = 0; i < 4; i++) {
        this.push(new Tile(4, value, false));
      }
    }
    
    // Create dragons (family 5)
    for (let value = 1; value <= 3; value++) {
      for (let i = 0; i < 4; i++) {
        this.push(new Tile(5, value, false));
      }
    }
  }
}
