import { Deck } from "../deck";
import { Hand } from "../hand";
import { Group } from "../group"

// Configuration globale
const CANVAS_ID = "myCanvas";
const BG_COLOR = "#007730";
const BG_RECT = { x: 50, y: 50, w: 1000, h: 1000 };
const FPS = 30;
const FRAME_INTERVAL = 1000 / FPS;

// variables globales
const DECKS: Array<Deck> = [];
const HANDS: Array<Hand> = [];
let selectedTile: number|undefined = undefined;

// Optimisation des références
let animationFrameId: number;
let lastFrameTime = 0;
const callbacks: Array<() => void> = [];

// Pré-calcul des dimensions
const canvas = document.getElementById(CANVAS_ID) as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as NonNullable<CanvasRenderingContext2D>;

// Cache statique
const staticCanvas = document.createElement('canvas') as HTMLCanvasElement;
const staticCtx = staticCanvas.getContext("2d") as NonNullable<CanvasRenderingContext2D>;
staticCanvas.width = canvas.width;
staticCanvas.height = canvas.height;

// Pré-rendu du fond
function prerenderBackground() {
  staticCtx.clearRect(0, 0, canvas.width, canvas.height);
	staticCtx.fillStyle = BG_COLOR;
	staticCtx.fillRect(BG_RECT.x, BG_RECT.y, BG_RECT.w, BG_RECT.h);
};

function drawFrame() {
    if (!ctx) return;
    
    // Effacement intelligent (uniquement la zone nécessaire)
		prerenderBackground();
    
		// Ici viendrait le dessin des éléments dynamiques
    // Par exemple:
    // drawDeck();
    // drawHands();
		let x = 300;
		let y = 150;
		let xos = 250;
		let yos = 100;
		let size = 0.75;

		staticCtx.fillStyle = "#DFDFFF";
		staticCtx.font = "50px serif";

		staticCtx.fillText("Chii:", 75, y + 100 * size - 5);
		HANDS[0].drawHand(staticCtx, x, y, 5, 0.75); // chii
		HANDS[1].drawHand(staticCtx, x + (75+xos)*size, y, 5, 0.75);

		staticCtx.fillText("Pon:", 75, y + (100+yos)*size + 100 * size - 5);
		HANDS[2].drawHand(staticCtx, x, y + (100+yos)*size, 5, 0.75); // pon
		HANDS[3].drawHand(staticCtx, x + (75+xos)*size, y + (100+yos)*size, 5, 0.75);
		HANDS[4].drawHand(staticCtx, x + 2*(75+xos)*size, y + 2*(100+yos)*size, 5, 0.75);

		staticCtx.fillText("Invalide:", 75, y + 2*(100+yos)*size + 100 * size - 5);
		HANDS[5].drawHand(staticCtx, x, y + 2*(100+yos)*size, 5, 0.75); // wrong
		HANDS[6].drawHand(staticCtx, x + (75+xos)*size, y + 2*(100+yos)*size, 5, 0.75);
		HANDS[7].drawHand(staticCtx, x + 2*(75+xos)*size, y + 2*(100+yos)*size, 5, 0.75);

		HANDS[8].drawHand(staticCtx, 100, 800, 5, size, selectedTile);

		let groups = HANDS[8].toGroup();
		if (groups !== undefined) {
			staticCtx.fillStyle = "#FF0000";
			staticCtx.font = "50px serif";
			staticCtx.fillText("Tous les groupes sont formés !", 100, 750);
		}
		groups = [];

		// Dessin du cache statique
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(staticCanvas, 0, 0);	
}

function animationLoop(currentTime: number) {
    animationFrameId = requestAnimationFrame(animationLoop);

    const deltaTime = currentTime - lastFrameTime;
    if (deltaTime < FRAME_INTERVAL) return;

    lastFrameTime = currentTime - (deltaTime % FRAME_INTERVAL);
    drawFrame();
}

function initEventListeners() {
    const handlers = {
        mousemove: (e: MouseEvent) => {
					let size = 0.75;
					let x = 100;
          // Logique de gestion du mouvement de la souris
					const rect = canvas.getBoundingClientRect();
					const mouseX = e.clientX - rect.left - x;
					const mouseY = e.clientY - rect.top;

					let q = Math.floor(mouseX / (80 * size));
					let r = mouseX - q * 80 * size;
					if (r <= 75 && q >= 0 && q < 14 && mouseY >= 800 && mouseY <= 800 + 100*size) {
						selectedTile = q;
					} else {
						selectedTile = undefined;
					}
        },
        mousedown: (e: MouseEvent) => {
          // Logique de gestion du clic de souris
					if (selectedTile !== undefined) {
						DECKS[0].push(HANDS[8].eject(selectedTile));
						DECKS[0].shuffle();
						HANDS[8].push(DECKS[0].pop());
						HANDS[8].sort();
					}
        }
    };

    callbacks.push(() => {
        canvas.removeEventListener('mousemove', handlers.mousemove);
        canvas.removeEventListener('mousedown', handlers.mousedown);
    });

    canvas.addEventListener('mousemove', handlers.mousemove);
    canvas.addEventListener('mousedown', handlers.mousedown);
}

async function preloadDeck(deck: Deck) {
    await deck.preload();
}
async function preloadHand(hand: Hand) {
	await hand.preload();
}

export function cleanup() {
    cancelAnimationFrame(animationFrameId);
    callbacks.forEach(fn => fn());
}

export async function initDisplay() {
    if (!ctx) {
        console.error("Context canvas indisponible");
        return;
    }

    // Préchargement des ressources si nécessaire
    // const deck = new Deck();
    // await preloadDeck(deck);
		DECKS.push(
			new Deck(false)
		);
		HANDS.push(
			new Hand("s1s2s3"),
			new Hand("m2m3m4"),
			new Hand("p5p5p5"),
			new Hand("w2w2w2"),
			new Hand("d3d3d3"),
			new Hand("s4p5m6"),
			new Hand("m9s9p9"),
			new Hand("d1d2d3"),
			DECKS[0].getRandomHand()
		);
		await Promise.all(DECKS.map(d => preloadDeck(d)));
		await Promise.all(HANDS.map(h => preloadHand(h)));
		
		HANDS[8].push(DECKS[0].pop());
		HANDS[8].sort();
    
		initEventListeners();
    requestAnimationFrame(animationLoop);
    window.cleanup = cleanup;
}

// Déclaration globale pour TypeScript
declare global {
    interface Window {
        cleanup: () => void;
    }
}

// Initialisation automatique si le script est chargé directement
if (typeof window !== 'undefined') {
    initDisplay().catch(console.error);
}

