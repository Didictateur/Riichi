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
            // Logique de gestion du mouvement de la souris
        },
        mousedown: (e: MouseEvent) => {
            // Logique de gestion du clic de souris
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
		await Promise.all(DECKS.map(d => preloadDeck(d)));
		await Promise.all(HANDS.map(h => preloadHand(h)));

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

