import { Deck } from "../deck";
import { Hand } from "../hand";
import { Group } from "../group";
import { Game } from "../game"

// Configuration globale
const CANVAS_ID = "myCanvas";
const BG_COLOR = "#007730";
const BG_RECT = { x: 50, y: 50, w: 1000, h: 1000 };
const FPS = 30;
const FRAME_INTERVAL = 1000 / FPS;

// variables globales
const DECKS: Array<Deck> = [];
const HANDS: Array<Hand> = [];
var GAME: Game|undefined;

// variables for the game
var selectedTile: number|undefined;
var turn: number = 0;
var hasPlayed: boolean = false;
var pCurrentTime = 0;
var pDeltaTime = 500;

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

		let size = 0.65;
		let os = 5;
		let w = size * (450 + 5 * os);
		let center = 525;
    
    // Effacement intelligent (uniquement la zone nécessaire)
		prerenderBackground();
    
		// Ici viendrait le dessin des éléments dynamiques
    // Par exemple:
    // drawDeck();
    // drawHands();
		// staticCtx.fillStyle = "#005530";
		// staticCtx.fillRect(center - w/2, center - w/2, w, w);

		GAME?.drawGame(staticCtx, size, 0.6, selectedTile);
   
		// Dessin du cache statique
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(staticCanvas, 0, 0);
}

function animationLoop(currentTime: number) {
    animationFrameId = requestAnimationFrame(animationLoop);

		// bot playing
		if (turn !== 0 && (currentTime - pCurrentTime) > pDeltaTime && (GAME as NonNullable<Game>).getDeck().length() > 0) {
			pCurrentTime = currentTime;
			let n = Math.floor(Math.random() * (GAME as NonNullable<Game>).getHands()[turn].length());
			GAME?.discard(turn, n);
			turn = (turn + 1) % 4;
			GAME?.pick(turn);
			GAME?.getHands()[0].sort();
		}

    const deltaTime = currentTime - lastFrameTime;
    if (deltaTime < FRAME_INTERVAL) return;

    lastFrameTime = currentTime - (deltaTime % FRAME_INTERVAL);
    drawFrame();
}

function initEventListeners() {
    const handlers = {
        mousemove: (e: MouseEvent) => {
          // Logique de gestion du mouvement de la souris
					let size = 0.75;
					let x = 2.5 * 75 * 0.75;
					let y = 1000 - 150 * 0.6;
					const rect = canvas.getBoundingClientRect();
					const mouseX = e.clientX - rect.left - x;
					const mouseY = e.clientY - rect.top;

					let q = Math.floor(mouseX / (80 * size));
					let r = mouseX - q * 80 * size;
					if (
						r <= 75 &&
						q >= 0 &&
						q < (GAME as NonNullable<Game>).getHands()[0].length() &&
						mouseY >= y &&
						mouseY <= y + 100 * size
					) {
						selectedTile = q;
					} else {
						selectedTile = undefined;
					}
        },
        mousedown: (e: MouseEvent) => {
          // Logique de gestion du clic de souris
					if (turn === 0 && selectedTile !== undefined && (GAME as NonNullable<Game>).getDeck().length() > 0) {
						GAME?.discard(0, selectedTile);
						turn++;
						GAME?.pick(turn);
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
		);
		HANDS.push(
		);
		GAME = new Game();
		await Promise.all(DECKS.map(d => preloadDeck(d)));
		await Promise.all(HANDS.map(h => preloadHand(h)));
		await GAME?.preload();

		GAME.pick(0);
		GAME.getHands()[0].sort();

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

