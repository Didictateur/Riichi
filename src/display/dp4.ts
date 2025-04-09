import { Deck } from "../deck";
import { Hand } from "../hand";
import { Game } from "../game"

// Configuration globale
const CANVAS_ID = "myCanvas";
const BG_RECT = { x: 0, y: 0, w: 1050, h: 1050 };
var MOUSE = { x: 0, y: 0 };
const FPS = 60;
const FRAME_INTERVAL = 1000 / FPS;

// variables globales
const DECKS: Array<Deck> = [];
const HANDS: Array<Hand> = [];
var GAME: Game|undefined;

// Optimisation des références
let animationFrameId: number;
let lastFrameTime = 0;
const callbacks: Array<() => void> = [];

// Pré-calcul des dimensions
const canvas = document.getElementById(CANVAS_ID) as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as NonNullable<CanvasRenderingContext2D>;
canvas.width = BG_RECT.w;
canvas.height = BG_RECT.h;

// Cache statique
const staticCanvas = document.createElement('canvas') as HTMLCanvasElement;
const staticCtx = staticCanvas.getContext("2d") as NonNullable<CanvasRenderingContext2D>;
staticCanvas.width = canvas.width;
staticCanvas.height = canvas.height;

function drawFrame() {
    if (!ctx) return;
		GAME?.draw(MOUSE);
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
			mousedown: (e: MouseEvent) => {
				GAME?.click(e);
			},
      mousemove: (e: MouseEvent) => {
				MOUSE.x = e.x;
				MOUSE.y = e.y;
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

		console.log("Load begining\n");
    // Préchargement des ressources si nécessaire
    // const deck = new Deck();
    // await preloadDeck(deck);
		DECKS.push(
		);
		HANDS.push(
		);
		GAME = new Game(
			ctx,
			canvas,
			staticCtx,
			staticCanvas
		);
		await Promise.all(DECKS.map(d => preloadDeck(d)));
		await Promise.all(HANDS.map(h => preloadHand(h)));
		await GAME?.preload();

		console.log("Loaded completed\n");
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

