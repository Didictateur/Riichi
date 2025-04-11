import { Rain } from "../rain"

// Configuration globale
const CANVAS_ID = "myCanvas";
const BG_RECT = { x: 0, y: 0, w: 1050, h: 1050 };
const MOUSE = { x: 0, y: 0 };
const FPS = 60; // Réduit de 90 à 60 pour de meilleures performances
const FRAME_INTERVAL = 1000 / FPS;
const RAIN = new Rain();

// Optimisation des références
let animationFrameId: number;
let lastFrameTime = 0;
let accumulatedTime = 0;
const callbacks: Array<() => void> = [];
const timeStep = 1 / FPS;

// Pré-calcul des dimensions
const canvas = document.getElementById(CANVAS_ID) as HTMLCanvasElement;
const ctx = canvas.getContext("2d", { alpha: false }) as NonNullable<CanvasRenderingContext2D>;
canvas.width = BG_RECT.w;
canvas.height = BG_RECT.h;

// Cache statique
const staticCanvas = document.createElement('canvas') as HTMLCanvasElement;
const staticCtx = staticCanvas.getContext("2d", { alpha: false }) as NonNullable<CanvasRenderingContext2D>;
staticCanvas.width = canvas.width;
staticCanvas.height = canvas.height;

// Optimisation du rendu avec requestAnimationFrame
function drawFrame(deltaTime: number) {
    if (!ctx) return;
    
    // Mise à jour avec pas de temps fixe pour stabilité physique
    accumulatedTime += deltaTime / 1000; // Convertir en secondes
    
    // Mettre à jour la simulation avec un pas de temps fixe
    while (accumulatedTime >= timeStep) {
        RAIN.update(timeStep);
        accumulatedTime -= timeStep;
    }
    
    // Optimisation du rendu
    staticCtx.fillStyle = "#007730"; // Couleur de fond
    staticCtx.fillRect(BG_RECT.x, BG_RECT.y, BG_RECT.w, BG_RECT.h);
    
    // Dessin de la pluie
    RAIN.drawRain(staticCtx);
    
    // Copier le buffer au canvas principal
    ctx.drawImage(staticCanvas, 0, 0);
}

function animationLoop(currentTime: number) {
    if (!lastFrameTime) {
        lastFrameTime = currentTime;
        animationFrameId = requestAnimationFrame(animationLoop);
        return;
    }
    
    const deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;
    
    // Limiter la fréquence des mises à jour si le navigateur est trop lent
    if (deltaTime < 100) { // Ignorer les deltas trop grands (changement d'onglet, etc.)
        drawFrame(deltaTime);
    }
    
    animationFrameId = requestAnimationFrame(animationLoop);
}

function initEventListeners() {
    // Gestion des événements de redimensionnement et de pause
    const handleVisibilityChange = () => {
        if (document.hidden) {
            cancelAnimationFrame(animationFrameId);
            lastFrameTime = 0;
        } else {
            lastFrameTime = performance.now();
            animationFrameId = requestAnimationFrame(animationLoop);
        }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Ajouter le nettoyage de l'event listener
    callbacks.push(() => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    });
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
    
    console.log("Load beginning");
    
    try {
        // Préchargement des ressources
        await RAIN.preloadRain();
        console.log("Loading completed");
        
        // Initialiser les écouteurs d'événements
        initEventListeners();
        
        // Démarrer la boucle d'animation avec le temps actuel
        lastFrameTime = performance.now();
        animationFrameId = requestAnimationFrame(animationLoop);
        
        window.cleanup = cleanup;
    } catch (error) {
        console.error("Erreur lors de l'initialisation:", error);
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
