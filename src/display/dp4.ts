import { Deck } from "../deck";
import { Hand } from "../hand";
import { Game } from "../game";

function showPlayButton() {
	const button = document.createElement('button');
	button.id = 'playButton';
	button.textContent = 'Jouer';
	button.style.position = 'absolute';
	button.style.left = `${1050/2}px`;
	button.style.top = `${1050/2}px`;
	button.style.transform = 'translate(-50%, -50%)';
	button.style.fontSize = '2rem';
	button.style.padding = '1em 2em';
	button.style.zIndex = '1000';

	document.body.appendChild(button);

	button.addEventListener('click', async () => {
		button.disabled = true;
		button.textContent = 'Chargement...';
		await initDisplay();
		button.remove();
	});
}

class RiichiGameManager {
  // Configuration globale
  private readonly CANVAS_ID: string = "myCanvas";
  private readonly BG_RECT = { x: 0, y: 0, w: 1050, h: 1050 };
  private readonly FPS: number = 60;
  private readonly FRAME_INTERVAL: number = 1000 / this.FPS;
  
  // Singleton instance
  private static instance: RiichiGameManager;
  
  // Canvas et contextes
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private staticCanvas: HTMLCanvasElement;
  private staticCtx: CanvasRenderingContext2D;
  
  // État du jeu
  private mouse = { x: 0, y: 0 };
  private game: Game | null = null;
  private decks: Array<Deck> = [];
  private hands: Array<Hand> = [];
  
  // Animation et boucle de jeu
  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;
  private isInitialized: boolean = false;
  
  // Nettoyage
  private cleanupCallbacks: Array<() => void> = [];
  
  /**
   * Constructeur privé pour le Singleton
   */
  private constructor() {
    // Initialisation du canvas principal
    const canvas = document.getElementById(this.CANVAS_ID) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error(`Canvas avec ID '${this.CANVAS_ID}' introuvable`);
    }
    this.canvas = canvas;
    this.canvas.width = this.BG_RECT.w;
    this.canvas.height = this.BG_RECT.h;
    
    // Récupération du contexte 2D
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) {
      throw new Error("Impossible d'obtenir le contexte 2D du canvas");
    }
    this.ctx = ctx;
    
    // Initialisation du canvas pour le double-buffering
    this.staticCanvas = document.createElement('canvas');
    this.staticCanvas.width = canvas.width;
    this.staticCanvas.height = canvas.height;
    
    const staticCtx = this.staticCanvas.getContext("2d", { alpha: false });
    if (!staticCtx) {
      throw new Error("Impossible d'obtenir le contexte du canvas statique");
    }
    this.staticCtx = staticCtx;
  }
  
  /**
   * Accès à l'instance Singleton
   */
  public static getInstance(): RiichiGameManager {
    if (!RiichiGameManager.instance) {
      RiichiGameManager.instance = new RiichiGameManager();
    }
    return RiichiGameManager.instance;
  }
  
  /**
   * Dessine une frame du jeu
   */
  private drawFrame(): void {
    if (this.game) {
      this.game.draw(this.mouse);
    }
  }
  
  /**
   * Démarre la boucle d'animation du jeu
   */
  private startAnimationLoop(): void {
    const animationLoop = (currentTime: number) => {
      this.animationFrameId = requestAnimationFrame(animationLoop);
      
      const deltaTime = currentTime - this.lastFrameTime;
      if (deltaTime < this.FRAME_INTERVAL) return;
      
      // Correction du time drift
      this.lastFrameTime = currentTime - (deltaTime % this.FRAME_INTERVAL);
      
      // Rendu d'une frame
      this.drawFrame();
    };
    
    this.animationFrameId = requestAnimationFrame(animationLoop);
  }
  
  /**
   * Initialise les écouteurs d'événements
   */
  private initEventListeners(): void {
    // Handler pour le déplacement de la souris
    const mouseMoveHandler = (e: MouseEvent) => {
      // Calcul des coordonnées relatives au canvas
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    };
    
    // Handler pour le clic de souris
    const mouseDownHandler = (e: MouseEvent) => {
      if (this.game) {
        this.game.click(e);
      }
    };
    
    // Enregistrement des écouteurs
    this.canvas.addEventListener('mousemove', mouseMoveHandler);
    this.canvas.addEventListener('mousedown', mouseDownHandler);
    
    // Enregistrement des callbacks de nettoyage
    this.cleanupCallbacks.push(() => {
      this.canvas.removeEventListener('mousemove', mouseMoveHandler);
      this.canvas.removeEventListener('mousedown', mouseDownHandler);
    });
  }
  
  /**
   * Précharge un deck
   */
  private async preloadDeck(deck: Deck): Promise<void> {
    await deck.preload();
  }
  
  /**
   * Précharge une main
   */
  private async preloadHand(hand: Hand): Promise<void> {
    await hand.preload();
  }
  
  /**
   * Initialise le jeu
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      console.log("Chargement en cours...");
      
      // Création du jeu
      this.game = new Game(
        this.ctx,
        this.canvas,
        this.staticCtx,
        this.staticCanvas
      );
      
      // Préchargement parallèle des ressources
      await Promise.all([
        ...this.decks.map(deck => this.preloadDeck(deck)),
        ...this.hands.map(hand => this.preloadHand(hand)),
        this.game.preload()
      ]);
      
      console.log("Chargement terminé");
      
      // Initialisation des écouteurs d'événements
      this.initEventListeners();
      
      // Démarrage de la boucle d'animation
      this.startAnimationLoop();
      
      // Marquer comme initialisé
      this.isInitialized = true;
      
      // Définir la fonction de nettoyage global
      window.cleanup = this.cleanup.bind(this);
      
    } catch (error) {
      console.error("Erreur lors de l'initialisation:", error);
    }
  }
  
  /**
   * Nettoie les ressources
   */
  public cleanup(): void {
    // Arrêter la boucle d'animation
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    // Exécuter tous les callbacks de nettoyage
    this.cleanupCallbacks.forEach(callback => callback());
    this.cleanupCallbacks = [];
    
    // Nettoyer les ressources du jeu
    if (this.game) {
      // Supposons que Game a une méthode cleanup
      (this.game as any).cleanup?.();
      this.game = null;
    }
    
    // Nettoyer les ressources des decks et des mains
    this.decks.forEach(deck => deck.cleanup());
    this.hands.forEach(hand => hand.cleanup());
    
    // Vider les collections
    this.decks = [];
    this.hands = [];
    
    // Réinitialiser l'état
    this.isInitialized = false;
    this.lastFrameTime = 0;
    this.mouse = { x: 0, y: 0 };
    
    // Effacer les canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.staticCtx.clearRect(0, 0, this.staticCanvas.width, this.staticCanvas.height);
  }
}

// Fonction de nettoyage globale exportée
export function cleanup(): void {
  RiichiGameManager.getInstance().cleanup();
}

// Fonction d'initialisation globale exportée
export async function initDisplay(): Promise<void> {
  await RiichiGameManager.getInstance().initialize();
}

// Déclaration globale pour TypeScript
declare global {
  interface Window {
    cleanup: () => void;
  }
}

// Initialisation automatique si le script est chargé directement
if (typeof window !== 'undefined') {
	showPlayButton();
}
