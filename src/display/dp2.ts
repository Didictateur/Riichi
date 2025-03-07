import { Deck } from "../deck";
import { Hand } from "../hand"

declare global {
	interface Window {
		cleanup: () => void;
	}
}
export {}

const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;

async function preloadDeck(deck: Deck) {
	await deck.preload();
}

async function display () {
	if (canvas) {
  	const ctx = canvas.getContext("2d") as NonNullable<CanvasRenderingContext2D>;

	  if (ctx) {
			// double buffering
			const offScreenCanvas = document.createElement('canvas') as HTMLCanvasElement;
			offScreenCanvas.width = canvas.width;
			offScreenCanvas.height = canvas.height;
			const offScreenCtx = offScreenCanvas.getContext('2d') as NonNullable<CanvasRenderingContext2D>;

			//animation parameter
			let lastTime = 0;
			const FPS = 30;
			const interval = 1000 / FPS;

			// tuiles
			let x = 150;
			let y = 150;
			let os = 75;
			let size = 0.75;
			const deck = new Deck(false);
			await preloadDeck(deck);

			let hands: Array<Hand> = [];
			for (let i = 0; i < 4; i++) {
				const hand = deck.getRandomHand();
				hand.sort();
				hands.push(hand);
			}

			// interactive hand
			const edeck = new Deck(false);
			await edeck.preload();
			const ehand = edeck.getRandomHand();
			ehand.sort();

			let selectedTile: number|undefined = undefined;

			// function to draw
			const drawCanvas = async () => {
				// clean screeen
				offScreenCtx.clearRect(0, 0, canvas.width, canvas.height);

				// tapis
  	  	offScreenCtx.fillStyle = "#007730";
    		offScreenCtx.fillRect(50, 50, 1000, 1000);

				// texte
				offScreenCtx.fillStyle = "#DFDFFF";
				offScreenCtx.font = "50px serif";
				offScreenCtx.fillText("Exemples de main:", 65, 100);

				// example hands
				for (let i = 0; i < hands.length; i++) {
					hands[i].drawHand(offScreenCtx, x, y + i * size * (100 + os), 5, size);
				}

				// dynamic hand
				ehand.drawHand(offScreenCtx, x, 800, 5, size, selectedTile);

				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(offScreenCanvas, 0, 0);
			}

			const animationLoop = (currentTime: number) => {
				const deltaTime = currentTime - lastTime;

				if (deltaTime >= interval) {
					lastTime = currentTime;
					drawCanvas();
				}
				requestAnimationFrame(animationLoop);
			}

			// mouse event
			canvas.addEventListener(
				"mousemove",
				(event) => {
					const rect = canvas.getBoundingClientRect();
					const mouseX = event.clientX - rect.left - x;
					const mouseY = event.clientY - rect.top;

					let q = Math.floor(mouseX / (80 * size));
					let r = mouseX - q * 80 * size;
					if (r <= 75 && q >= 0 && q < 14 && mouseY >= 800 && mouseY <= 800 + 100*size) {
						selectedTile = q;
					} else {
						selectedTile = undefined;
					}
				}
			);

			requestAnimationFrame(animationLoop);

			window.cleanup = () => {
				deck.cleanup();
				hands.forEach(hand => hand.cleanup());
				hands = [];
				edeck.cleanup();
				ehand.cleanup();
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				offScreenCtx.clearRect(0, 0, offScreenCanvas.width, offScreenCanvas.height);
				selectedTile = undefined;
			}

  	} else {
    	console.error("Impossible d'obtenir le contexte du canvas.");
  	}
	} else {
  	console.error("Canvas introuvable dans le DOM.");
	}
}

display();
