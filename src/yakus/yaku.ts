import { Hand } from "../hand";
import { Group } from "../group";
import { Tile } from "../tile"

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
			(t.getValue() === 1 ||
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

function green(t: Tile): boolean {
	let f = t.getFamily();
	let v = t.getValue();
	if (f !== 5 && f !== 3) {
		return false;
	}

	if (f === 5) {
		return v === 2;
	}

	return v % 2 === 0 || v === 3;
}





export const yakus = {

/**
 * double suite pure
 * 0/1
 */
lipekou: function (
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

/**
 * deux doubles suites pures
 * 0/3
 */
ryanpeikou: function (
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

/**
 * tout suite
 * 0/1
 */
pinfu: function(	
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

/**
 * triple suite
 * 1/2
 */
sanshokuDoujun: function(
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

/**
 * grande suite pure
 * 1/2
 */
ittsuu: function(	
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

/**
 * tout ordinaire
 * 1/1
 */
tanyao: function(	
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

/**
 * brelan de valeur
 * 1/1
 */
yakuhai: function(	
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

/**
 * trois petits dragons
 * 2/2
 */
shousangen: function(	
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

/**
 * trois grands dragons
 * 13/13
 */
daisangen: function(	
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

/**
 * quatre petits vents
 * 13/13
 */
shousuushii: function(	
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

/**
 * quatre grands vents
 * 13/13
 */
daisuushi: function(	
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

/**
 * terminales et honneurs partout
 * 1/2
 */
chanta: function(	
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	let gr = groups.concat(hand.toGroup() as NonNullable<Array<Group>>);
	gr = gr.filter(
		g => {
			let tiles = g.getTiles();
			let f = tiles[0].getFamily();
			let v = tiles[0].getValue();
			let vd = tiles[tiles.length - 1].getValue();
			return f < 4 && v !== 1 && vd !== 9
		}
	);
	if (gr.length > 0) {
		return 0;
	}
	return groups.length > 0 ? 1 : 2;
},

/**
 * terminales partout
 * 2/3
 */
junchan: function(
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	let gr = groups.concat(hand.toGroup() as NonNullable<Array<Group>>);
	gr = gr.filter(
		g => {
			let tiles = g.getTiles();
			let f = tiles[0].getFamily();
			let v = tiles[0].getValue();
			let vd = tiles[tiles.length - 1].getValue();
			return f > 3 || (v !== 1 && vd !== 9)
		}
	);
	if (gr.length > 0) {
		return 0;
	}
	return groups.length > 0 ? 2 : 3;
},

/**
 * tout terminale et honneur
 * 2/2
 */
honroutou: function(	
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	let gr = groups.concat(hand.toGroup() as NonNullable<Array<Group>>);
	gr = gr.filter(
		g => {
			let tiles = g.getTiles();
			let f = tiles[0].getFamily();
			let v = tiles[1].getValue();
			return f < 4 && v !== 1 && v !== 9
		}
	);
	if (gr.length > 0) {
		return 0;
	}
	return 2;
},

/**
 * tout terminale
 * 13/13
 */
chinroutou: function(	
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	let gr = groups.concat(hand.toGroup() as NonNullable<Array<Group>>);
	if (
		gr.every(g => term(g))
	) {
		return 13;
	}
	return 0;
},

/**
 * tout honneur
 * 13/13
 */
tsuuiisou: function(	
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

/**
 * treize orphelins
 * 0/13
 */
kokushiMusou: function(
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	if (groups.length > 0) {
		return 0;
	}
	let h = hand.getTiles();
	if (
		h.some(t =>
			t.getFamily() < 4 &&
			t.getValue() > 1 &&
			t.getValue() < 9
		)
	) {
		return 0;
	}
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

/**
 * sept paires
 * 0/2
 */
chiitoitsu: function(
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	if (groups.length > 0) {
		return 0;
	}
	let h = hand.getTiles();
	if (h.length !== 14) {
		return 0;
	}
	for (let i = 0; i < 14; i += 2) {
		if (
			h[i].compare(h[i+1]) !== 0 ||
			(i > 0 && h[i].compare(h[i-1]) === 0)
		) {
			return 0
		}
	}
	return 2;
},

/**
 * tout brelans
 * 2/2
 */
toitoi: function(
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

/**
 * trois brelan cachés
 * 2/2
 */
sanankou: function(	
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

/**
 * quatre brelans cachés
 * 0/13
 */
suuankou: function(
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

/**
 * triple brelan
 * 2/2
 */
sanshokuDoukou: function(
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
	gr = gr.filter(g => pon(g) && g.getTiles().length === 3);
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

/**
 * trois carrés
 * 2/2
 */
sankantsu: function( //TODO
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	return 0;
},

/**
 * quatre carrés
 * 13/13
 */
suukantsu: function( //TODO
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	return 0;
},

/**
 * semie pure
 * 2/3
 */
honitsu: function(
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
	gr.sort((g1, g2) => g1.compare(g2))
	if (gr.length === 0) {
		return 0;
	}
	if (gr[gr.length - 1].getTiles()[0].getFamily() < 4) { // main pure
		return 0;
	}
	let f = gr[0].getTiles()[0].getFamily();
	if (f > 3) { // tout honneur
		return 0;
	}
	if (gr.every(
		g => {
			let ff = g.getTiles()[0].getFamily();
			return ff > 3 || f === ff
		}
	)) {
		return groups.length > 0 ? 2 : 3;
	}
	return 0;
},

/**
 * main pure
 * 5/6
 */
chinitsu: function(
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

/**	 
 * main verte
 * 13/13
 */
ryuuisou: function(
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	if (groups.length > 0) {
		return 0;
	}
	let h = hand.toGroup();
	if (h?.every(
		g => g.getTiles().every(
			t => green(t)
		)
	)) {
		return 13;
	}
	return 0;
},

/**
 * neuf portes
 * 0/13
 */
chuurenPoutou: function(
	hand: Hand,
	groups: Array<Group>,
	wind: number
): number {
	if (groups.length > 0 || yakus.chinitsu(hand, groups, wind) === 0) {
		return 0;
	}
	let tiles = hand.getTiles();
	if (tiles[0].getFamily() >= 4) {
		return 0;
	}

	let pureHand = [tiles[0].getValue()];
	let count = 1;
	for (let i = 1; i < tiles.length; i++) {
		let v = tiles[i].getValue();
		let lastv = pureHand[pureHand.length - 1];
		
		if (v === 1 || v === 9) {
			if (v === lastv) {
				count++;
				if (count < 4) {
					pureHand.push(v);
				} else if (count > 4) {
					return 0;
				}
			} else {
				count = 1;
				pureHand.push(v);
			}
		
		} else {
			if (v === lastv) {
				count ++;
				if (count < 2) {
					pureHand.push(v);
				} else if (count > 2) {
					return 0;
				}
			} else {
				count = 1;
				pureHand.push(v);
			}
		}
	}

	if (pureHand.toString() === [1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 9].toString()) {
		return 13;
	}
	return 0;
}

}
