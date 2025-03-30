import { Deck } from "./deck";
import { Hand } from "./hand";
import { Tile } from "./tile";
import { Group } from "./group";
import { drawButtons, clickAction, drawChiis, clickChii } from "./button";
import { drawState } from "./state";

export type mousePos = { x: number, y: number};

export class Game {
	private deck: Deck;
	private deadWall: Array<Tile> = [];
	private hands: Array<Hand> = [];
	private discards: Array<Array<Tile>>;
	private lastDiscard: number|undefined;
	private groups: Array<Array<Group>>;

	// game values
	private level: number;
	private turn = 0;
	private selectedTile: number|undefined = undefined;
	private canCall: boolean = false;
	private hasPicked: boolean = false;
	private hasPlayed: boolean = false;
	private lastPlayed: number = Date.now();
	private chooseChii: boolean = false;
	private end: boolean = false;
	private result: number = -1;

	// display parameter
	private BG_RECT = {color: "#007730", x: 0, y: 0, w: 1050, h: 1050};
	private sizeHand = 0.7;
	private sizeHiddenHand = 0.6;
	private sizeDiscard = 0.6;

	// canvas
	private ctx: CanvasRenderingContext2D;
	private cv: HTMLCanvasElement;
	private staticCtx: CanvasRenderingContext2D;
	private staticCv: HTMLCanvasElement;

	public constructor(
		ctx: CanvasRenderingContext2D,
		cv: HTMLCanvasElement,
		staticCtx: CanvasRenderingContext2D,
		staticCv: HTMLCanvasElement,
		red: boolean = false,
		level: number = 0
	) {
		this.ctx = ctx;
		this.cv = cv;
		this.staticCtx = staticCtx;
		this.staticCv = staticCv;
		this.level = level;
		this.deck = new Deck(red);
		this.deck.shuffle();
		for (let i = 0; i < 14; i++) {
			this.deadWall.push(this.deck.pop());
		}
		for (let i = 0; i < 4; i++) {
			this.hands.push(this.deck.getRandomHand());
		}
		this.discards = [[], [], [], []];
		this.lastDiscard = undefined;
		this.groups = [[], [], [], []];

		this.hands[0].sort();
		this.pick(0);
	}

	public draw(mp: mousePos) {
		// background
		this.staticCtx.clearRect(0, 0, this.cv.width, this.cv.height);
		this.staticCtx.fillStyle = this.BG_RECT.color;
		this.staticCtx.fillRect(
			this.BG_RECT.x,
			this.BG_RECT.y,
			this.BG_RECT.w,
			this.BG_RECT.h
		);

		this.getSelected(mp);

		this.drawGame();
		this.ctx.clearRect(0, 0, this.cv.width, this.cv.height);
		this.ctx.drawImage(this.staticCv, 0, 0);
	}

	public getDeck(): Deck {
		return this.deck;
	}

	public getHands(): Array<Hand> {
		return this.hands;
	}

	public isFinished(): boolean {
		return this.end;
	}

	public click( // player is playing
		mp: mousePos,
	): void {
		const rect = this.cv.getBoundingClientRect();

		if (this.hasWin(0)) {
			this.end = true;
			this.result = 1;
		} else if (this.chooseChii) { // is choosing
			let allChii = this.getChii(0);
			let c = clickChii(
				mp.x - rect.x,
				mp.y - rect.y,
				allChii
			);	
			if (c === 0) {
				this.chooseChii = false;
			} else {
				this.chooseChii = false;
				this.chii(c, 0);
			}
		} else {
			let action = clickAction(
				mp.x - rect.left,
				mp.y - rect.top,
				this.canDoAChii().length > 0,
				this.canDoAPon(),
				false && this.level > 1,
				false && this.level > 0,
				false && this.level > 0
			);

			if (this.canCall && action !== -1) { // can call
				if (action === 0) { // pass
					this.canCall = false;
					if (this.turn === 3) {
						this.turn = 0;
						this.pick(0);
					} else {
						this.turn++;
					}
					this.hasPicked = true;
					this.hasPlayed = false;
				} else if (action === 1) { // chii
					let chiis = this.canDoAChii();
					if (chiis.length === 1) { // only one possible
						this.chii(chiis[0], 0);
					} else {
						this.chooseChii = true;
						this.drawGame();
					}
				} else if (action == 2) { // pon
					this.pon(this.turn);
				}

			} else { // nothing unusual
				if (this.turn === 0 && this.selectedTile !== undefined) {
					this.discard(0, this.selectedTile as NonNullable<number>);
					if (!this.checkPon()) {
						let chiis = this.canDoAChii(1);
						if (chiis.length > 0) {
							let i = Math.floor(Math.random() * chiis.length);
							this.chii(chiis[i], 1);
						} else {
							this.turn = (this.turn + 1) % 4;
						}
					}
				}
			}
		}
	}

	private getSelected(
		mp: mousePos,
	): void {
		const rect = this.cv.getBoundingClientRect();
		let x = 2.5 * 75 * 0.75;
		let y = 1050 - 250 * 0.6;
		
		const mouseX = mp.x - rect.left - x;
		const mouseY = mp.y - rect.top;
		const s = 83.9;

		let q = Math.floor(mouseX / (s * this.sizeHand));
		let r = mouseX - q * s * this.sizeHand;
		if (
			r <= (s - 3) * this.sizeHand &&
			q >= 0 &&
			q < this.hands[0].length() &&
			mouseY >= y &&
			mouseY <= y + 100 * this.sizeHand
		) {
			this.selectedTile = q;
		} else {
			this.selectedTile = undefined;
		}
	};

	private play(): void {
		if (
			this.turn !== 0 && !this.end
		) { // bot playing
			if (!this.hasPicked) { // begin of his turn
				this.lastPlayed = Date.now();
				this.pick(this.turn);
				this.hasPicked = true;
			} else if (!this.hasPlayed) { // middle of his turn
				if (this.hasWin(this.turn)) {
					this.end = true;
					this.result = 2;
				} else if (Date.now() - this.lastPlayed > 700) {
					this.lastPlayed = Date.now();
					let n = Math.floor(this.hands[this.turn].length() * Math.random());
					this.discard(this.turn, n);
					this.hasPlayed = true;
					if (this.deck.length() <= 0) {
						this.result = 0;
						this.end = true;
					}
					if (!this.end) {
						this.checkPon();
						if (this.turn !== 3 && this.canDoAChii(this.turn + 1).length > 0) {
							let chiis = this.canDoAChii(this.turn + 1);
							let i = Math.floor(Math.random() * chiis.length);
							this.chii(chiis[i], this.turn + 1);
						}
						this.canCall = this.canDoAChii().length > 0 || this.canDoAPon();
					}
				}
			} else if (!this.canCall) { // end of his turn
				if (this.turn === 3) {
					this.turn = 0;
					this.pick(0);
					if (this.hasWin(0)) {
						this.end = true;
						this.result = 1;
					}
				} else {
					this.turn++;
				}
				this.hasPicked = false;
				this.hasPlayed = false;
			}
		}
	}

	private pick(player: number): void {
		this.hands[player].push(this.deck.pop());
		this.hands[player].isolate = true;
	}

	private discard(player: number, n: number): void {
		let tile = this.hands[player].eject(n);
		this.hands[player].sort();
		tile.setTilt();
		this.discards[player].push(tile);
		this.hands[player].isolate = false;
		this.hands[player].sort();
		this.lastDiscard = player;
		this.lastPlayed = Date.now();
	}

	private canDoAChii(p: number = 0): Array<number> {
		let chii = [] as Array<number>;
		if (
			this.lastDiscard !== undefined &&
			(this.lastDiscard + 1) % 4 === p &&
			(this.turn + 1) % 4  === p &&
			this.discards[this.lastDiscard][this.discards[this.lastDiscard].length-1].getFamily() < 4
		) {
			let t = this.discards[this.lastDiscard][this.discards[this.lastDiscard].length-1];
			let h = this.hands[p];
			if (
				h.count(t.getFamily(), t.getValue()-2) > 0 &&
				h.count(t.getFamily(), t.getValue()-1) > 0
			) {
				chii.push(t.getValue()-2);
			}
			if (
				h.count(t.getFamily(), t.getValue()-1) > 0 &&
				h.count(t.getFamily(), t.getValue()+1) > 0
			) {
				chii.push(t.getValue()-1);
			}
			if (
				h.count(t.getFamily(), t.getValue()+1) > 0 &&
				h.count(t.getFamily(), t.getValue()+2) > 0
			) {
				chii.push(t.getValue());
			}
		}
		return chii;
	}

	private chii(minValue: number, p: number): void {
		let t = this.discards[p === 0 ? 3 : p - 1].pop() as NonNullable<Tile>;
		this.lastDiscard = undefined;
		let tn = 0;
		let v = minValue;
		let tt: Array<Tile> = [];
		while (tn < 2) {
			if (v === t.getValue()) {
				v++;
			} else {
				tt[tn] = this.hands[p].find(t.getFamily(), v) as NonNullable<Tile>;
				tn++;
				v++;
			}
		}
		[t, tt[0], tt[1]].forEach(t => t.setTilt());
		this.groups[p].push(new Group([t, tt[0], tt[1]], p === 0 ? 3 : p - 1, p));

		if (this.hasWin(p)) {
			this.end = true;
			this.result = p === 0 ? 1 : 2;
		}

		this.turn = p;
		this.hasPicked = true;
		this.hasPlayed = false;
	}

	private getChii(p: number): Array<Array<Tile>> {
		let chiis = [] as Array<Array<Tile>>;
		let numChii = this.canDoAChii();

		let d = this.discards[p === 0 ? 3 : p - 1];
		let t = d[d.length - 1]

		for (let i = 0; i < numChii.length; i++) {
			let v = numChii[i];
			let chii = [];
			for (let dv = 0; dv < 3; dv++) {
				if (v + dv === t.getValue()) {
					chii.push(t);
				} else {
					let tt = this.hands[p].find(t.getFamily(), v + dv) as NonNullable<Tile>;
					chii.push(tt);
					this.hands[p].push(tt);
					this.hands[p].sort();
				}
			}
			chiis.push(chii);
		}
		return chiis;
	}

	private checkPon(): boolean {
		for (var p = 1; p < 4; p++) {
			if (this.canDoAPon(p)) {
				this.pon(this.lastDiscard as NonNullable<number>, p);
				return true;
			}
		}
		return false;
	}

	private canDoAPon(player: number = 0): boolean {
		if (
			this.lastDiscard !== undefined &&
			this.lastDiscard !== player &&
			this.turn !== player
		) {
			let t = this.discards[this.lastDiscard][this.discards[this.lastDiscard].length-1];
			return this.hands[player].count(t.getFamily(), t.getValue()) >= 2;
		} else {
			return false;
		}
	}

	private pon(p: number, thief: number = 0): void {
		let t = this.discards[p].pop() as NonNullable<Tile>;
		this.lastDiscard = undefined;
		let t2 = this.hands[thief].find(t.getFamily(), t.getValue()) as NonNullable<Tile>;
		let t3 = this.hands[thief].find(t.getFamily(), t.getValue()) as NonNullable<Tile>;
		[t, t2, t3].forEach(t => t.setTilt());
		this.groups[thief].push(new Group([t, t2, t3], p, thief));

		if (this.hasWin(thief)) {
			this.end = true;
			this.result = thief === 0 ? 1 : 2;
		}

		this.turn = thief;
		this.hasPicked = true;
		this.hasPlayed = false;
	}

	private hasWin(p: number): boolean {
		return this.hands[p].toGroup() !== undefined
	}

	private drawGame(): void {
		// update game
		this.play();

		// draw winds, discard, riichi etc...
		drawState(this.staticCtx, this.turn);
		this.drawDiscardSize();

		// draw result
		this.drawResult();

		// hands
		this.drawHands();
	
		// groups
		this.drawGroups(0.6);

		// discards
		for (let i = 0; i < 4; i++) {
			this.drawDiscard(
				i,
				this.hands[0].get(this.selectedTile) as NonNullable<Tile>
			);
		}

		// called
		if (this.chooseChii) {
			drawChiis(this.staticCtx, this.getChii(0));
		} else {
			drawButtons(
				this.staticCtx,
				this.canDoAChii().length > 0,
				this.canDoAPon(),
				false && this.level > 1,
				false && this.level > 0,
				false && this.level > 0
			);
		}
	}

	private drawHands() {
		const pi = 3.141592;
		const showHands = true;
		
		this.hands[0].drawHand(
			this.staticCtx,
			2.5 * 75 * 0.75,
			1000 - 150 * this.sizeHand,
			5 * this.sizeHand,
			0.75,
			this.selectedTile,
			false,
			0
		);
		this.hands[1].drawHand(
			this.staticCtx,
			1000 - 150 * this.sizeHiddenHand,
			1000 - 75 * 5 * this.sizeHiddenHand,
			5 * this.sizeHiddenHand,
			this.sizeHiddenHand,
			undefined,
			!showHands,
			- pi / 2
		);
		this.hands[2].drawHand(
			this.staticCtx,
			1000 - 75 * 5 * this.sizeHiddenHand,
			150 * this.sizeHiddenHand,
			5 * this.sizeHiddenHand,
			this.sizeHiddenHand,
			undefined,
			!showHands,
			- pi
		);
		this.hands[3].drawHand(
			this.staticCtx,
			150 * this.sizeHiddenHand,
			75 * 5 * this.sizeHiddenHand,
			5 * this.sizeHiddenHand,
			this.sizeHiddenHand,
			undefined,
			!showHands,
			pi / 2
		);

	}

	private drawGroups(
		size: number,
	): void {
		let os = 25;
		const pi = 3.141592;
		for ( let p = 0; p < 4; p++) {
			let rotation = [0, -pi / 2, -pi, pi / 2][p];
			if (this.groups[p].length > 0) {
				for (let i = this.groups[p].length-1; i >= 0; i--) {
					this.groups[p][i].drawGroup(
						this.staticCtx,
						1050 - 240 - (260 + os) * size * i,
						1050 - 62,
						5,
						0.6,
						rotation,
						this.hands[0].get(this.selectedTile)
					);
				}
			}
		}
	}

	private drawDiscard(
		p: number,
		highlitedTile: Tile|undefined
	): void {
		const pi = 3.141592;

		this.staticCtx.save();
		this.staticCtx.translate(525, 525);
		this.staticCtx.rotate([0, -pi/2, -pi, pi/2][p])

		let x = - this.sizeDiscard * 475 / 2;
		let y = this.sizeDiscard * (475 / 2 + 5);
		for (let i = 0; i < this.discards[p].length; i++) {
			let tile = this.discards[p][i];
			if (i < 12) {
				tile.drawTile(
					this.staticCtx,
					x + (i % 6) * 80 * this.sizeDiscard,
					y + Math.floor(i / 6) * 105 * this.sizeDiscard,
					this.sizeDiscard,
					false,
					0,
					highlitedTile?.isEqual(tile.getFamily(), tile.getValue())
				);
			} else {
				tile.drawTile(
					this.staticCtx,
					x + (i - 12) * 80 * this.sizeDiscard,
					y + 2 * 105 * this.sizeDiscard,
					this.sizeDiscard,
					false,
					0,
					highlitedTile?.isEqual(tile.getFamily(), tile.getValue())
				);
			}
		}
		if (this.lastDiscard === p) {
			const j = this.discards[p].length - 1;
			let tx =
				j < 12 ?
				x + (j % 6) * 80 * this.sizeDiscard :
				x + (j - 12) * 80 * this.sizeDiscard;
			let ty =
				j < 12 ?
				y + Math.floor(j / 6) * 105 * this.sizeDiscard :
				y + 2 * 105 * this.sizeDiscard;
			tx += 75 / 2 * this.sizeDiscard;
			ty += 115 * this.sizeDiscard;
			const ts = 10;
			this.staticCtx.fillStyle = "#ff0000";
			this.staticCtx.beginPath();
			this.staticCtx.moveTo(tx, ty);

			this.staticCtx.lineTo(tx + ts/2, ty + 0.866 * ts);
			this.staticCtx.lineTo(tx - ts/2, ty + 0.866 * ts);
			this.staticCtx.lineTo(tx, ty);

			this.staticCtx.fill();
			this.staticCtx.stroke();
		}

		this.staticCtx.restore();
	}

	private drawDiscardSize() {
		this.staticCtx.fillStyle = "#f070f0";

		this.staticCtx.font = "40px garamond";
		this.staticCtx.fillText(this.deck.length().toString(), 507, 537);
	}

	private drawResult(): void {
		if (this.result !== -1) {
			this.staticCtx.fillStyle = "#e0e0f0";
			this.staticCtx.fillRect(450, 430, 150, 190);
			this.staticCtx.fillRect(430, 450, 190, 150);
			this.staticCtx.fillStyle = "#ff0000";
			this.staticCtx.font = "45px garamond";

		}
		if (this.result === 0) { // Égalité
			this.staticCtx.fillText("Égalité", 450, 535);
		} else if (this.result === 1) { // victoire
			this.staticCtx.fillText("Victoire !", 440, 535);
		} else if (this.result === 2) { // Défaite
			this.staticCtx.fillText("Défaite...", 440, 535);
		}
	}

	public async preload(): Promise<void> {
		await this.deck.preload();
		await Promise.all(this.hands.map(h => h.preload()));
	}
	
}
