import { Deck } from "../deck";
import { Hand } from "../hand";
import { Game } from "../game"

// Configuration globale
const CANVAS_ID = "myCanvas";
const BG_RECT = { x: 0, y: 0, w: 1050, h: 1050 };
var MOUSE = { x: 0, y: 0 };
const FPS = 30;
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
    });

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
    // Charge et affiche l'image "ron.png" sur la partie gauche du canvas
    try {
        const ronImg = new Image();
        ronImg.src = "img/ron.png";
        await new Promise<void>((resolve) => {
            ronImg.onload = () => resolve();
            ronImg.onerror = () => {
                console.warn("Impossible de charger img/ron.png");
                resolve();
            };
        });

    // Dessin de l'image en plein écran (remplit tout le canvas)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(ronImg, 0, 0, canvas.width, canvas.height);
    } catch (err) {
        console.error("Erreur lors du rendu de ron.png", err);
    }
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

