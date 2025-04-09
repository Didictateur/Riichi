import { Tile } from "./tile"
import { Deck } from "./deck"

const G: number = 100;
const SIZE: number = 1;
const LIMIT_MAX = 1100;
const SPAWN_CHANCE = 0.75;
const INITIAL_Y = -150;
const INITIAL_VY = 50;
const MAX_X = 1000;
const ROTATION_FACTOR = Math.PI;
const MOMENTUM_RANGE = 1;

class FallingTile {
	private tile: Tile;
	private x: number;
	private y: number;
	private vy: number = INITIAL_VY;
	private orientation: number;
	private momentum: number;

	public constructor(
		tile: Tile,
		x: number,
		y: number,
		orientation: number,
		momentum: number
	) {
		this.tile = tile;
		this.x = x;
		this.y = y;
		this.orientation = orientation;
		this.momentum = momentum;
	}

	public update(dt: number): void {
		this.vy += dt * G;
		this.y += dt * this.vy;
		this.orientation += dt * this.momentum;
	}

	public isOutside(): boolean {
		return this.y > LIMIT_MAX;
	}

	public getTile(): Tile {
		return this.tile;
	}

	public drawFallingTile(ctx: CanvasRenderingContext2D): void {
		this.tile?.drawTile(
			ctx,
			this.x,
			this.y,
			SIZE,
			false,
			this.orientation,
			false,
			false
		);
	}
}

export class Rain {
	private deck: Deck;
	private tiles: FallingTile[] = [];
	private tileAddTimer: number = 0;

	public constructor() {
		this.deck = new Deck(true);
	}

	public update(dt: number): void {
		let i = this.tiles.length;
		
		while (i--) {
			const tile = this.tiles[i];
			tile.update(dt);
			
			if (tile.isOutside()) {
				this.deck.push(tile.getTile());
				this.tiles.splice(i, 1);
			}
		}

		this.tileAddTimer += dt;
		if (this.tileAddTimer >= (1 / SPAWN_CHANCE)) {
			this.addFallingTile();
			this.tileAddTimer = 0;
		} else if (Math.random() < SPAWN_CHANCE * dt) {
			this.addFallingTile();
		}
	}

	public addFallingTile(): void {
		if (this.deck.length() === 0) {
			return;
		}
		
		if (this.deck.length() > 1) {
			this.deck.shuffle();
		}
		
		const newTile = new FallingTile(
			this.deck.pop()!,
			Math.floor(Math.random() * MAX_X),
			INITIAL_Y,
			Math.random() * ROTATION_FACTOR,
			(Math.random() * 2 - 1) * MOMENTUM_RANGE
		);
		
		this.tiles.push(newTile);
	}

	public drawRain(ctx: CanvasRenderingContext2D): void {
		for (const tile of this.tiles) {
			tile.drawFallingTile(ctx);
		}
	}

	public async preloadRain(): Promise<void> {
		console.log("preload rain");
		await this.deck.preload();
	}
}
