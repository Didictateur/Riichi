import { Hand } from "../hand";
import { function_generator } from "../yakus/generator"

// Configuration globale
const CANVAS_ID = "myCanvas";
const FPS = 30;
const FRAME_INTERVAL = 1000 / FPS;

/**
 * Classe RiichiDisplay responsable de la gestion de l'affichage du jeu Riichi Mahjong
 */
class RiichiDisplay {
  // Canvas principal et contexte
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  
  // Ressources du jeu
  private hands: Array<Hand> = [];
	private handTexts: Array<string> = [];
	private wind: number = Math.floor(Math.random() * 4);
  
  // Animation et événements
  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;
  private cleanupCallbacks: Array<() => void> = [];
  
  // Constantes pour le rendu
  private readonly BASE_X: number = 50;
  private readonly BASE_Y: number = 90;
	private readonly DY = 160;
  private readonly SIZE: number = 0.75;
  
  constructor(canvasId: string = CANVAS_ID) {
    // Initialisation du canvas
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error(`Canvas avec ID '${canvasId}' introuvable`);
    }
    this.canvas = canvas;
    
    // Récupération du contexte 2D
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Impossible d'obtenir le contexte 2D du canvas");
    }
    this.ctx = ctx;
  }
  
  /**
   * Dessine une frame complète
   */
  private drawFrame(): void {
    // Copie du canvas statique vers le canvas principal
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
		// Dessin des éléments statiques et dynamiques
    this.drawHandsAndLabels();
  }
  
  /**
   * Dessine les mains et leurs étiquettes
   */
  private drawHandsAndLabels(): void {
		for (let i = 0; i < this.hands.length; i++) {

			this.ctx.fillStyle = "#DFDFFF";
			this.ctx.font = "40px serif";
			this.ctx.fillText(this.handTexts[i], this.BASE_X, this.BASE_Y - 20 + i * this.DY);

    	this.hands[i].drawHand(
				this.ctx,
				this.BASE_X,
				this.BASE_Y + i * this.DY,
				5,
				this.SIZE
			);
		}
  }
  
  /**
   * Démarre la boucle d'animation
   */
  private startAnimationLoop(): void {
    const animationLoop = (currentTime: number) => {
      this.animationFrameId = requestAnimationFrame(animationLoop);
      
      const deltaTime = currentTime - this.lastFrameTime;
      if (deltaTime < FRAME_INTERVAL) return;
      
      this.lastFrameTime = currentTime - (deltaTime % FRAME_INTERVAL);
      this.drawFrame();
    };
    
    this.animationFrameId = requestAnimationFrame(animationLoop);
  }
  
  /**
   * Précharge une main
   */
  private async preloadHand(hand: Hand): Promise<void> {
    await hand.preload();
  }
  
  /**
   * Initialise l'affichage et démarre l'application
   */
  public async initialize(): Promise<void> {
    try {
      // Création des mains prédéfinies
      this.hands.push(
				function_generator.ordinaires(),
				function_generator.brelan_valeur(this.wind),
				function_generator.main_pure(),
				function_generator.main_semi_pure(),
				function_generator.double_suite(),
				function_generator.sept_pairs()
      );

			this.handTexts.push(
				"Tout ordinaires :",
				"Brelan de valeur (" + ["Est", "Sud", "Ouest", "Nord"][this.wind] + ") :",
				"Main pure :",
				"Main semi-pure :",
				"Double suite :",
				"Sept pairs :"
			);

      // Préchargement parallèle des ressources
      await Promise.all([
        ...this.hands.map(hand => this.preloadHand(hand))
      ]);

      // Premier rendu
      this.drawFrame();
      
      // Démarrage de la boucle d'animation
      this.startAnimationLoop();
      
    } catch (error) {
      console.error("Erreur d'initialisation:", error);
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
    
    // Nettoyer les ressources des decks et des mains
    this.hands.forEach(hand => hand.cleanup());
    
    // Vider les collections
    this.hands = [];
  }
}

// Instance globale pour le nettoyage
let displayInstance: RiichiDisplay | null = null;

/**
 * Fonction de nettoyage exportée
 */
export function cleanup(): void {
  if (displayInstance) {
    displayInstance.cleanup();
    displayInstance = null;
  }
}

/**
 * Fonction d'initialisation exportée
 */
export async function initDisplay(): Promise<void> {
  try {
    displayInstance = new RiichiDisplay(CANVAS_ID);
    await displayInstance.initialize();
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
