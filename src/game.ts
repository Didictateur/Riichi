import { Deck } from "./deck";
import { Hand } from "./hand";
import { Tile } from "./tile";

export class Game {
	private deck: Deck;
	private hands: Array<Hand>;
	private discards: Array<Array<Tile>>;

	public constructor(red: boolean = false) {
		this.deck = new Deck(red);
		this.hands = [
			this.deck.getRandomHand(),
			this.deck.getRandomHand(),
			this.deck.getRandomHand(),
			this.deck.getRandomHand()
		];
		this.discards = [[], [], [], []];
	}

	public getDeck(): Deck {
		return this.deck;
	}

	public getHands(): Array<Hand> {
		return this.hands;
	}

	public drawGame(
		ctx: CanvasRenderingContext2D,
		discardSize: number,
		handSize: number,
		selectedTile: number|undefined = undefined
	): void {
		const pi = 3.141592;
		this.hands[0].drawHand(
			ctx,
			2.5 * 75 * 0.75,
			1000 - 150 * handSize,
			5 * handSize,
			0.75,
			selectedTile,
			false,
			0
		);
		this.hands[1].drawHand(
			ctx,
			1000 - 150 * handSize,
			1000 - 75 * 5 * handSize,
			5 * handSize,
			handSize,
			undefined,
			true,
			- pi / 2
		);
		this.hands[2].drawHand(
			ctx,
			1000 - 75 * 5 * handSize,
			150 * handSize,
			5 * handSize,
			handSize,
			undefined,
			true,
			- pi
		);
		this.hands[3].drawHand(
			ctx,
			150 * handSize,
			75 * 5 * handSize,
			5 * handSize,
			handSize,
			undefined,
			true,
			pi / 2
		);

		for (let i = 0; i < 4; i++) {
			this.drawDiscrad(ctx, i, discardSize);
		}
	}

	public pick(player: number): void {
		this.hands[player].push(this.deck.pop());
	}

	public discard(player: number, n: number): void {
		let tile = this.hands[player].eject(n);
		tile.setTilt();
		this.discards[player].push(tile);
	}

	public async preload(): Promise<void> {
		await this.deck.preload();
		await Promise.all(this.hands.map(h => h.preload()));
	}

	private drawDiscrad(
		ctx: CanvasRenderingContext2D,
		p: number,
		discardSize: number
	): void {
		const pi = 3.141592;

		ctx.save();
		ctx.translate(525, 525);
		ctx.rotate([0, -pi/2, -pi, pi/2][p])

		let x = - discardSize * 475 / 2;
		let y = discardSize * (475 / 2 + 5);
		for (let i = 0; i < this.discards[p].length; i++) {
			if (i < 12) {
				this.discards[p][i].drawTile(
					ctx,
					x + (i % 6) * 80 * discardSize,
					y + Math.floor(i / 6) * 105 * discardSize,
					discardSize
				);
			} else {
				this.discards[p][i].drawTile(
					ctx,
					x + (i - 12) * 80 * discardSize,
					y + 2 * 105 * discardSize,
					discardSize
				);
			}
		}

		ctx.restore();
	}
}
