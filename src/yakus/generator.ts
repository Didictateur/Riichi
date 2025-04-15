import { Hand } from "../hand"
import { Deck } from "../deck"
import { Tile } from "../tile";

export const function_generator = {

	ordinaires(): Hand {
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

	sept_pairs(): Hand {
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


