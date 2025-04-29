import { Hand } from "../hand"
import { Deck } from "../deck"
import { Tile } from "../tile";

export const function_generator = {

	ordinaires(wind: number = 0): Hand {
		let h = new Hand();
		let deck = new Deck();
		deck.shuffle();
		
		// choix d'une paire
		let t1 = deck.pop();
		let t2 = deck.find(t1.getFamily(), t1.getValue()) as NonNullable<Tile>;
		h.push(t1);
		h.push(t2);

		let count = 2;
		while (count !== 14) {
			if (Math.random() < 0.5) { // pon
				let t1 = deck.pop();
				let f = t1.getFamily();
				let v = t1.getValue();
				if (
					f < 4 && v !== 1 && v !== 9 &&
					deck.count(f, v) > 1
				) {
					let t2 = deck.find(f, v) as NonNullable<Tile>;
					let t3 = deck.find(f, v) as NonNullable<Tile>;
					h.push(t1);
					h.push(t2);
					h.push(t3);
					count += 3;
				} else {
					deck.push(t1);
					deck.shuffle();
				}
			} else { // chii
				let t1 = deck.pop();
				let f = t1.getFamily();
				let v = t1.getValue();
				if (
					f < 4 && v !== 1 && v < 6 &&
					deck.count(f, v + 1) > 0 &&
					deck.count(f, v + 2) > 0
				) {
					let t2 = deck.find(f, v + 1) as NonNullable<Tile>;
					let t3 = deck.find(f, v + 2) as NonNullable<Tile>;
					h.push(t1);
					h.push(t2);
					h.push(t3);
					count += 3;
				} else {
					deck.push(t1);
					deck.shuffle();
				}
			}
		}
		h.sort();
		return h;
	},

	brelan_valeur(wind: number = 0): Hand {
		let h = new Hand();
		let deck = new Deck();
		deck.shuffle();
		
		// brelan
		let f: number;
		let v: number;
		if (Math.random() < 1/3) { // dragons
			f = 5;
			v = Math.floor(Math.random() * 3) + 1;
		} else if (Math.random() < 0.5) { // est
			f = 4;
			v = 1;
		} else { // vent du joueur
			f = 4;
			v = wind + 1;
		}
		h.push(deck.find(f, v) as NonNullable<Tile>);
		h.push(deck.find(f, v) as NonNullable<Tile>);
		h.push(deck.find(f, v) as NonNullable<Tile>);
		let count = 3;

		// pair
		f = Math.floor(Math.random() * 3) + 1;
		v = Math.floor(Math.random() * 9) + 1;
		while (deck.count(f, v) < 2) {
			f = Math.floor(Math.random() * 3) + 1;
			v = Math.floor(Math.random() * 9) + 1;
		}
		h.push(deck.find(f, v) as NonNullable<Tile>);
		h.push(deck.find(f, v) as NonNullable<Tile>);
		count += 2;

		while (count !== 14) {
			if (Math.random() < 0.5) { // pon
				let t1 = deck.pop();
				let f = t1.getFamily();
				let v = t1.getValue();
				if (
					deck.count(f, v) > 1
				) {
					h.push(t1);
					h.push(deck.find(f, v) as NonNullable<Tile>);
					h.push(deck.find(f, v) as NonNullable<Tile>);
					count += 3;
				} else {
					deck.push(t1);
					deck.shuffle();
				}

			} else { // chii
				let f = Math.floor(Math.random() * 3) + 1;
				let v = Math.floor(Math.random() * 7) + 1;
				if (
					deck.count(f, v) > 1 &&
					deck.count(f, v + 1) > 1 &&
					deck.count(f, v + 2) > 1
				) {
					h.push(deck.find(f, v) as NonNullable<Tile>);
					h.push(deck.find(f, v + 1) as NonNullable<Tile>);
					h.push(deck.find(f, v + 2) as NonNullable<Tile>);
					count += 3;
				}

			}
		}
		h.sort();
		return h;
	},

	main_pure(wind: number = 0): Hand {
		let h = new Hand();
		let deck = new Deck();
		deck.shuffle();
		let f = Math.floor(Math.random() * 3) + 1;

		let v = Math.floor(Math.random() * 9) + 1;
		h.push(deck.find(f, v) as NonNullable<Tile>);
		h.push(deck.find(f, v) as NonNullable<Tile>);
		let count = 2;

		while (count < 14) {
			if (Math.random() < 0.5) { // pon
				let v = Math.floor(Math.random() * 9) + 1;
				if (deck.count(f, v) > 2) {
					for (let i = 0; i < 3; i++) {
						h.push(deck.find(f, v) as NonNullable<Tile>);
						count++;
					}
				}

			} else { // chii
				let v = Math.floor(Math.random() * 7) + 1;
				if (
					deck.count(f, v) > 0 &&
					deck.count(f, v+1) > 0 &&
					deck.count(f, v+2) > 0
				) {
					for (let i = 0; i < 3; i++) {
						h.push(deck.find(f, v + i) as NonNullable<Tile>);
						count++;
					}
				}
			}
		}
		h.sort();
		return h;
	},

	main_semi_pure(wind: number = 0): Hand {
		let h = new Hand();
		let deck = new Deck();
		deck.shuffle();
		let f = Math.floor(Math.random() * 3) + 1;

		let v = Math.floor(Math.random() * 9) + 1;
		h.push(deck.find(f, v) as NonNullable<Tile>);
		h.push(deck.find(f, v) as NonNullable<Tile>);
		let count = 2;

		let family = Math.floor(Math.random() * 2) + 4;
		let value = Math.floor(Math.random() * 3) + 1;
		h.push(deck.find(family, value) as NonNullable<Tile>);
		h.push(deck.find(family, value) as NonNullable<Tile>);
		h.push(deck.find(family, value) as NonNullable<Tile>);
		count += 3;

		while (count < 14) {
			if (Math.random() < 0.5) { // pon

				if (Math.random() < 0.5) { // famille
					let v = Math.floor(Math.random() * 9) + 1;
					if (deck.count(f, v) > 2) {
						for (let i = 0; i < 3; i++) {
							h.push(deck.find(f, v) as NonNullable<Tile>);
							count++;
						}
					}
				} else if (Math.random() < 0.5) { // vent
					let v = Math.floor(Math.random() * 4) + 1;
					if (deck.count(4, v) > 2) {
						for (let i = 0; i < 3; i++) {
							h.push(deck.find(4, v) as NonNullable<Tile>);
							count++;
						}
					}
				} else { // dragon
					let v = Math.floor(Math.random() * 3) + 1;
					if (deck.count(5, v) > 2) {
						for (let i = 0; i < 3; i++) {
							h.push(deck.find(5, v) as NonNullable<Tile>);
							count++;
						}
					}
				}

			} else { // chii
				let v = Math.floor(Math.random() * 7) + 1;
				if (
					deck.count(f, v) > 0 &&
					deck.count(f, v+1) > 0 &&
					deck.count(f, v+2) > 0
				) {
					for (let i = 0; i < 3; i++) {
						h.push(deck.find(f, v + i) as NonNullable<Tile>);
						count++;
					}
				}
			}
		}
		h.sort();
		return h;
	},

	double_suite(wind: number = 0): Hand {
		let h = new Hand();
		let deck = new Deck();
		deck.shuffle();
		
		// choix d'une paire
		let t1 = deck.pop();
		let t2 = deck.find(t1.getFamily(), t1.getValue()) as NonNullable<Tile>;
		h.push(t1);
		h.push(t2);
		let count = 2;
		
		// double suite
		let f = Math.floor(Math.random() * 3) + 1;
		let v = Math.floor(Math.random() * 7) + 1;
		while (
			deck.count(f, v) < 2 ||
			deck.count(f, v + 1) < 2 ||
			deck.count(f, v + 2 ) < 2
		) {
			f = Math.floor(Math.random() * 3) + 1;
			v = Math.floor(Math.random() * 7) + 1;
		}
		h.push(deck.find(f, v) as NonNullable<Tile>);
		h.push(deck.find(f, v) as NonNullable<Tile>);
		h.push(deck.find(f, v + 1) as NonNullable<Tile>);
		h.push(deck.find(f, v + 1) as NonNullable<Tile>);
		h.push(deck.find(f, v + 2) as NonNullable<Tile>);
		h.push(deck.find(f, v + 2) as NonNullable<Tile>);
		count += 6;

		while (count !== 14) {
			if (Math.random() < 0.5) { // pon
				let t1 = deck.pop();
				let f = t1.getFamily();
				let v = t1.getValue();
				if (
					deck.count(f, v) > 1
				) {
					h.push(t1);
					h.push(deck.find(f, v) as NonNullable<Tile>);
					h.push(deck.find(f, v) as NonNullable<Tile>);
					count += 3;
				} else {
					deck.push(t1);
					deck.shuffle();
				}

			} else { // chii
				let f = Math.floor(Math.random() * 3) + 1;
				let v = Math.floor(Math.random() * 7) + 1;
				if (
					deck.count(f, v) > 1 &&
					deck.count(f, v + 1) > 1 &&
					deck.count(f, v + 2) > 1
				) {
					h.push(deck.find(f, v) as NonNullable<Tile>);
					h.push(deck.find(f, v + 1) as NonNullable<Tile>);
					h.push(deck.find(f, v + 2) as NonNullable<Tile>);
					count += 3;
				}

			}
		}
		h.sort();
		return h;

	},

	sept_pairs(wind: number = 0): Hand {
		let h = new Hand();
		let deck = new Deck();
		deck.shuffle();
		let count = 0;
		while (count !== 7) {
			let tile = deck.pop();
			if (h.getTiles().every(
				t => t.compare(tile) !== 0
			)) {
				count++;
				h.push(tile);
				h.push(new Tile(tile.getFamily(), tile.getValue(), false));
			}
		}
		h.sort();
		return h;
	}

}


