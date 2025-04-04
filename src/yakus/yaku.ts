import { Hand } from "../hand";
import { Group } from "../group";

function ord(g: Group): boolean {
	return g.getTiles().every(
		t => t.getFamily() < 4 &&
		t.getValue() > 1 &&
		t.getValue() < 9
	)
}

function term(g: Group): boolean {
	return g.getTiles().every(
		t =>
			t.getFamily() < 4 &&
			(t.getValue() === 0 ||
			 t.getValue() === 9)
	);
}

function honn(g: Group): boolean {
	return g.getTiles().every(
		t =>
			t.getFamily() >= 4
	);
}

function chii(g: Group): boolean {
	let t = g.getTiles();
	return t[0].getValue() !== t[1].getValue();
}

function pon(g: Group): boolean {
	let t = g.getTiles();
	return t[0].getValue() === t[1].getValue();
}





export const yakus = {

lipekou: function (
	/**
	 * double suite pure
	 * 0/1
	 */
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	if (groups.length > 0 && !yakus.ryanpeikou(hand, groups, wind)) { // ouvert
		return 0;
	}
	let gr = hand.toGroup() as NonNullable<Array<Group>>;
	gr.sort((g1, g2) => g1.compare(g2));
	for (let i = 0; i < 3; i++) {
		let g1 = gr[i].getTiles();
		let g2 = gr[i+1].getTiles();
		if (
			g1[0].isEqual(g2[0].getFamily(), g2[0].getValue()) &&
			chii(gr[i]) && chii(gr[i+1])
		) {
			return 1;
		}
	}
	return 0;
},

ryanpeikou: function (
	/**
	 * deux doubles suites pures
	 * 0/3
	 */
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	if (groups.length > 0) {
		return 0;
	}
	let gr = hand.toGroup() as NonNullable<Array<Group>>;
	gr.filter(g => chii(g));
	if (gr.length < 4) { // pas assez de suite
		return 0;
	}
	gr.sort((g1, g2) => g1.compare(g2));
	let t1 = gr[0].getTiles()[0];
	let t2 = gr[1].getTiles()[0];
	let t3 = gr[2].getTiles()[0];
	let t4 = gr[3].getTiles()[0];
	if (
		t1.compare(t2) === 0 &&
		t3.compare(t4) === 0
	) {
		return 3;
	}
	return 0;
},

pinfu: function(
	/**
	 * tout suite
	 * 0/1
	 */
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number { //TODO: double attente
	if (groups.length > 0) {
		return 0;
	}
	let h = hand.toGroup();
	if (
		h !== undefined &&
		h.every(
			g => {
				let tiles = g.getTiles();
				return (chii(g) || tiles.length === 2)
			}
		)
	) {
		return 1;
	}
	return 0;
},

sanshokuDoujun: function(
	/**
	 * triple suite
	 * 1/2
	 */
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	let h = hand.toGroup();
	let gr = [];
	if (h !== undefined) {
		gr = groups.concat(h);
	} else {
		gr = groups;
	}
	gr = gr.filter(g => chii(g));
	gr.sort((g1, g2) => g1.compare(g2))
	if (gr.length < 3) { // pas assez de chii
		return 0;
	} else if(gr.length === 3) {
		let t0 = gr[0].getTiles();
		let t1 = gr[1].getTiles();
		let t2 = gr[2].getTiles();
		if (
			t0[0].getValue() === t1[0].getValue() &&
			t0[0].getValue() === t2[0].getValue() &&
			t0[0].getFamily() !== t1[0].getFamily() &&
			t0[0].getFamily() !== t2[0].getFamily() &&
			t1[0].getFamily() !== t2[0].getFamily()
		) {
			return groups.length > 0 ? 1 : 2;
		}
		return 0;
	} else {// il y a un intrus
		for (let i = 0; i < 4; i++) {
			let index = []
			for (let j = 0; j < 4; j++) {
				if (j !== i) {
					index.push(j);
				}
			}
			let t0 = gr[index[0]].getTiles();
			let t1 = gr[index[1]].getTiles();
			let t2 = gr[index[2]].getTiles();
			if (
				t0[0].getValue() === t1[0].getValue() &&
				t0[0].getValue() === t2[0].getValue() &&
				t0[0].getFamily() !== t1[0].getFamily() &&
				t0[0].getFamily() !== t2[0].getFamily() &&
				t1[0].getFamily() !== t2[0].getFamily()
			) {
				return groups.length > 0 ? 1 : 2;
			}
		}
		return 0;
	}
},

ittsuu: function(
	/**
	 * grande suite pure
	 * 1/2
	 */
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	let gr = groups.concat(hand.toGroup() as NonNullable<Array<Group>>);
	gr = gr.filter(g => chii(g));
	gr.sort((g1, g2) => g1.compare(g2));
	if (gr.length < 3) { // trop peu de suite
		return 0;
	} else if (gr.length === 3) { // pile le bon nombre
		let g1 = gr[0].getTiles();
		let g2 = gr[1].getTiles();
		let g3 = gr[2].getTiles();
		if (
			g1[0].getFamily() === g2[0].getFamily() &&
			g2[0].getFamily() === g3[0].getFamily() &&
			g1[0].getValue() === 1 &&
			g2[0].getValue() === 4 &&
			g3[0].getValue() === 7
		) {
			return groups.length > 0 ? 1 : 2;
		}
	} else { // il y a un intrus
		for (let i = 0; i < 4; i++) {
			let index = []
			for (let j = 0; j < 4; j++) {
				if (j !== i) {
					index.push(j);
				}
			}
			let t0 = gr[index[0]].getTiles();
			let t1 = gr[index[1]].getTiles();
			let t2 = gr[index[2]].getTiles();
			if (
				t0[0].getValue() === 1 &&
				t1[0].getValue() === 4 &&
				t2[0].getValue() === 7 &&
				t0[0].getFamily() === t1[0].getFamily() &&
				t0[0].getFamily() === t2[0].getFamily()
			) {
				return groups.length > 0 ? 1 : 2;
			}
		}
		return 0;
	}
	return 0;
},

tanyao: function(
	/**
	 * tout ordinaire
	 * 1/1
	 */
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	let h = hand.toGroup();
	if (h === undefined) {
		return 0;
	}
	if (
		groups.every(g => ord(g)) &&
		h.every(g => ord(g))
	) {
		return 1;
	}
	return 0;
},

yakuhai: function(
	/**
	 * brelan de valeur
	 * 1/1
	 */
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	let gr = groups.concat(hand.toGroup() as NonNullable<Array<Group>>);
	gr = gr.filter(g => pon(g) && g.getTiles().length === 3);
	let han = 0;
	gr.forEach(
		g => {
			let t = g.getTiles();
			let f = t[0].getFamily();
			let v = t[0].getValue();
			if (f === 5) { // brelan de dragon
				han++;
			}
			if (f === 4 && v === 0) { // vent d'est
				han++;
			}
			if (f === 4 && v === wind) { // vent du joueur
				han++;
			}
		}
	);
	return han;
},

shousangen: function(
	/**
	 * trois petits dragons
	 * 2/2
	 */
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	let gr = groups.concat(hand.toGroup() as NonNullable<Array<Group>>);
	gr = gr.filter(g => pon(g));
	let nbPon = 0;
	let nbPair = 0;
	gr.forEach(
		g => {
			let t = g.getTiles();
			if (t[0].getFamily() === 5) {
				if (t.length === 3) {
					nbPon++;
				} else {
					nbPair++;
				}
			}
		}
	)
	if (nbPon == 2 && nbPair == 1) {
		return 2;
	}
	return 0;
},

daisangen: function(
	/**
	 * trois grands dragons
	 * 13/13
	 */
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	let gr = groups.concat(hand.toGroup() as NonNullable<Array<Group>>);
	gr = gr.filter(
		g => pon(g) &&
			g.getTiles().length === 3 &&
			g.getTiles()[0].getFamily() === 5
	);
	if (gr.length === 3) {
		return 13;
	}
	return 0;
},

shousuushii: function(
	/**
	 * quatre petits vents
	 * 13/13
	 */
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	let gr = groups.concat(hand.toGroup() as NonNullable<Array<Group>>);
	gr = gr.filter(g => pon(g));
	let nbPon = 0;
	let nbPair = 0;
	gr.forEach(
		g => {
			let t = g.getTiles();
			if (t[0].getFamily() === 4) {
				if (t.length === 3) {
					nbPon++;
				} else {
					nbPair++;
				}
			}
		}
	)
	if (nbPon == 3 && nbPair == 1) {
		return 13;
	}
	return 0;
},

daisuushi: function(
	/**
	 * quatre grands vents
	 * 13/13
	 */
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	let gr = groups.concat(hand.toGroup() as NonNullable<Array<Group>>);
	gr = gr.filter(g => pon(g));
	let nbPon = 0;
	let nbPair = 0;
	gr.forEach(
		g => {
			let t = g.getTiles();
			if (t[0].getFamily() === 4) {
				if (t.length === 3) {
					nbPon++;
				} else {
					nbPair++;
				}
			}
		}
	)
	if (nbPon == 4 && nbPair == 0) {
		return 13;
	}
	return 0;
},

chanta: function( //TODO
	/**
	 * terminales et honneurs partout
	 * 1/2
	 */
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	return 0;
},

junchan: function( //TODO
	/**
	 * terminales partout
	 * 2/3
	 */
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	return 0;
},

honroutou: function( //TODO
	/**
	 * tout terminale et honneur
	 * 2/2
	 */
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	return 0;
},

chinroutou: function(
	/**
	 * tout terminale
	 * 13/13
	 */
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	let h = hand.toGroup();
	if (h === undefined) {
		return 0;
	}
	if (
		groups.every(g => term(g)) &&
		h.every(g => term(g))
	) {
		return 13;
	}
	return 0;
},

tsuuiisou: function(
	/**
	 * tout honneur
	 * 13/13
	 */
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	let h = hand.toGroup();
	if (h === undefined) {
		return 0;
	}
	if (
		groups.every(g => honn(g)) &&
		h.every(g => honn(g))
	) {
		return 13;
	}
	return 0;
},

kokushiMusou: function(
	/**
	 * treize orphelins
	 * 0/13
	 */
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	if (groups.length > 0) {
		return 0;
	}
	if (yakus.honroutou(hand, groups, wind) === 0) {
		return 0;
	}
	let h = hand.getTiles();
	let count = 0;
	for (let i = 0; i < h.length - 1; i++) {
		if (h[i].isEqual(h[i+1].getFamily(), h[i+1].getValue())) {
			count++;
		}
		if (count > 1) {
			break;
		}
	}
	if (count === 1) {
		return 13;
	}
	return 0;
},

chiitoitsu: function(
	/**
	 * sept paires
	 * 0/2
	 */
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	return 0;
	if (groups.length > 0) {
		return 0;
	}
	//TODO
},

toitoi: function(
	/**
	 * tout brelans
	 * 2/2
	 */
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	let h = hand.toGroup();
	if (
		groups.every(g => pon(g)) &&
		h?.every(g => pon(g))
	) {
		return 2;
	}
	return 0;
},

sanankou: function(
	/**
	 * trois brelan cachés
	 * 2/2
	 */
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	let h = hand.toGroup();
	let count = 0;
	h?.forEach(
		g => {
			if (pon(g) && g.getTiles().length === 3) {
				count++;
			}
		}
	);
	if (count === 3) {
		return 2;
	}
	return 0;
},

suuankou: function(
	/**
	 * quatre brelans cachés
	 * 0/13
	 */
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	let h = hand.toGroup();
	let count = 0;
	h?.forEach(
		g => {
			if (pon(g) && g.getTiles().length === 3) {
				count++;
			}
		}
	);
	if (count === 4) {
		return 13;
	}
	return 0;
},

sanshokuDoukou: function( //TODO
	/**
	 * triple brelan
	 * 2/2
	 */
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	return 0;
},

sankantsu: function( //TODO
	/**
	 * trois carrés
	 * 2/2
	 */
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	return 0;
},

suukantsu: function( //TODO
	/**
	 * quatre carrés
	 * 13/13
	 */
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	return 0;
},

honitsu: function( //TODO
	/**
	 * semie pure
	 * 2/3
	 */
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	return 0;
},

chinitsu: function(
	/**
	 * main pure
	 * 5/6
	 */
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	let h = hand.getTiles();
	let t0 = h[0];
	if (
		h.every(t => t.getFamily() === t0.getFamily()) &&
		groups.every(g => g.getTiles().every(t => t.getFamily() === t0.getFamily()))
	) {
		return groups.length > 0 ? 5 : 6;
	}
	return 0;
},

ryuuisou: function( //TODO
	/**
	 * main verte
	 * 13/13
	 */
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	if (yakus.chinitsu(hand, groups, wind) === 0) {
		return 0;
	}
	return 0;
},

chuurenPoutou: function( //TODO
	/**
	 * neuf portes
	 * 0/13
	 */
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	if (groups.length > 0 || yakus.chinitsu(hand, groups, wind) === 0) {
		return 0;
	}
	return 0;
}

}
