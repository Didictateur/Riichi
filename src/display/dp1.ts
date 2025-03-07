import { Deck } from "../deck"

declare global {
	interface Window {
		clanup: () => void;
	}
}

export {};

async function preloadDeck(deck: Deck) {
	await deck.preload();
}

async function display() {
	const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;

	if (canvas) {
  	const ctx = canvas.getContext("2d");

  	if (ctx) {
			// tapis
    	ctx.fillStyle = "#007730";
    	ctx.fillRect(50, 50, 1000, 1000);

			// tuiles
			let x = 180;
			let y = 80;
			let size = 0.75;
			let xos = 50;
			let yos = 100;
			const deck = new Deck(false);
			await preloadDeck(deck);
			deck.displayFamilies(ctx, x, y, size, xos, yos);

			// texte
			ctx.fillStyle = "#DFDFFF";
			ctx.font = "30px serif";

			let delta = 50 * size;
			let eps = 30 * size;
			ctx.fillText("Caractère:", 55, y + delta + eps);
			ctx.fillText("Rond:", 55, y + 3 * delta + yos * size + eps);
			ctx.fillText("Bambou:", 55, y + 5 * delta + 2 * yos * size + eps);
			ctx.fillText("Vent:", 55, y + 7 * delta + 3 * yos * size + eps);
			ctx.fillText("Dragon:", 55, y + 9 * delta + 4 * yos * size + eps);

			// familles
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 9; j++) {
					ctx.fillText(
						String(j+1),
						x + j * (xos + 75) * size + 30 * size,
						y + i * (yos + 100) * size + 150 * size
					);
				}
			}

			// vent
			ctx.fillText(
				"Est",
				x + 0 * (xos + 75) * size,
				y + 3 * (yos + 100) * size + 150 * size
			);
			ctx.fillText(
				"Sud",
				x + 1 * (xos + 75) * size,
				y + 3 * (yos + 100) * size + 150 * size
			);
			ctx.fillText(
				"Ouest",
				x + 2 * (xos + 75) * size,
				y + 3 * (yos + 100) * size + 150 * size
			);
			ctx.fillText(
				"Nord",
				x + 3 * (xos + 75) * size,
				y + 3 * (yos + 100) * size + 150 * size
			);
		
			// dragon
			ctx.fillText(
				"Rouge",
				x + 0 * (xos + 75) * size,
				y + 4 * (yos + 100) * size + 150 * size
			);
			ctx.fillText(
				"Vert",
				x + 1 * (xos + 75) * size,
				y + 4 * (yos + 100) * size + 150 * size
			);
			ctx.fillText(
				"Blanc",
				x + 2 * (xos + 75) * size,
				y + 4 * (yos + 100) * size + 150 * size
			);

			window.cleanup = () => {
				deck.cleanup();
			}

  	} else {
    	console.error("Impossible d'obtenir le contexte du canvas.");
  	}
	} else {
  	console.error("Canvas introuvable dans le DOM.");
	}
}

display()

