import { Deck } from "../deck";
import { Hand } from "../hand";
import { Group } from "../group";

// Configuration globale
const CANVAS_ID = "myCanvas";
const BG_COLOR = "#007730";
const BG_RECT = { x: 50, y: 50, w: 1000, h: 1000 };
const FPS = 30;
const FRAME_INTERVAL = 1000 / FPS;

/**
 * Classe RiichiDisplay responsable de la gestion de l'affichage du jeu Riichi Mahjong
 */
class RiichiDisplay {
  // Canvas principal et contexte
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  
  // Canvas pour le double-buffering
  private staticCanvas: HTMLCanvasElement;
  private staticCtx: CanvasRenderingContext2D;
  
  // Ressources du jeu
  private decks: Array<Deck> = [];
  private hands: Array<Hand> = [];
  
  // État de l'interface
  private selectedTile: number | undefined = undefined;
  private isDirty: boolean = true;
  
  // Animation et événements
  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;
  private cleanupCallbacks: Array<() => void> = [];
  
  // Constantes pour le rendu
  private readonly BASE_X: number = 300;
  private readonly BASE_Y: number = 150;
  private readonly X_OFFSET: number = 250;
  private readonly Y_OFFSET: number = 100;
  private readonly INTERACTIVE_X: number = 100;
  private readonly INTERACTIVE_Y: number = 800;
  private readonly SIZE: number = 0.75;
  private readonly TILE_WIDTH: number = 78 * this.SIZE;
  private readonly MAX_TILES: number = 14;
  
  // Zones de détection pour l'interaction souris
  private tileRects: Array<{ x: number, y: number, width: number, height: number }> = [];
  
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
    
    // Initialisation du canvas pour le double-buffering
    this.staticCanvas = document.createElement('canvas');
    this.staticCanvas.width = canvas.width;
    this.staticCanvas.height = canvas.height;
    
    const staticCtx = this.staticCanvas.getContext("2d");
    if (!staticCtx) {
      throw new Error("Impossible d'obtenir le contexte du canvas statique");
    }
    this.staticCtx = staticCtx;
    
    // Pré-calcul des zones de détection
    this.calculateTileHitAreas();
  }
  
  /**
   * Pré-calcule les zones de détection pour l'interaction souris
   */
  private calculateTileHitAreas(): void {
    this.tileRects = [];
    for (let i = 0; i < this.MAX_TILES; i++) {
      this.tileRects.push({
        x: this.INTERACTIVE_X + i * this.TILE_WIDTH + (i === this.MAX_TILES - 1 ? 10 : 0),
        y: this.INTERACTIVE_Y,
        width: 75,
        height: 100 * this.SIZE
      });
    }
  }
  
  /**
   * Pré-rendu du fond statique
   */
  private prerenderBackground(): void {
    this.staticCtx.clearRect(0, 0, this.staticCanvas.width, this.staticCanvas.height);
    this.staticCtx.fillStyle = BG_COLOR;
    this.staticCtx.fillRect(BG_RECT.x, BG_RECT.y, BG_RECT.w, BG_RECT.h);
  }
  
  /**
   * Dessine une frame complète
   */
  private drawFrame(): void {
    // Vérifier si un redessinage est nécessaire
    if (!this.isDirty) return;
    
    // Pré-rendu du fond statique
    this.prerenderBackground();
    
    // Dessin des éléments statiques et dynamiques
    this.drawHandsAndLabels();
    
    // Affichage des informations sur les groupes
    this.checkAndDisplayGroups();
    
    // Copie du canvas statique vers le canvas principal
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.staticCanvas, 0, 0);
    
    // Réinitialisation du flag de modification
    this.isDirty = false;
  }
  
  /**
   * Dessine les mains et leurs étiquettes
   */
  private drawHandsAndLabels(): void {
    const ctx = this.staticCtx;
    
    // Configurer le style de texte
    ctx.fillStyle = "#DFDFFF";
    ctx.font = "50px serif";
    
    // Dessiner les mains "Chii"
    ctx.fillText("Chii:", 75, this.BASE_Y + 100 * this.SIZE - 5);
    this.hands[0].drawHand(ctx, this.BASE_X, this.BASE_Y, 5, this.SIZE);
    this.hands[1].drawHand(ctx, this.BASE_X + (75 + this.X_OFFSET) * this.SIZE, this.BASE_Y, 5, this.SIZE);
    
    // Dessiner les mains "Pon"
    ctx.fillText("Pon:", 75, this.BASE_Y + (100 + this.Y_OFFSET) * this.SIZE + 100 * this.SIZE - 5);
    this.hands[2].drawHand(ctx, this.BASE_X, this.BASE_Y + (100 + this.Y_OFFSET) * this.SIZE, 5, this.SIZE);
    this.hands[3].drawHand(ctx, this.BASE_X + (75 + this.X_OFFSET) * this.SIZE, this.BASE_Y + (100 + this.Y_OFFSET) * this.SIZE, 5, this.SIZE);
    
    // Dessiner les mains "Invalide"
    ctx.fillText("Invalide:", 75, this.BASE_Y + 2 * (100 + this.Y_OFFSET) * this.SIZE + 100 * this.SIZE - 5);
    this.hands[5].drawHand(ctx, this.BASE_X, this.BASE_Y + 2 * (100 + this.Y_OFFSET) * this.SIZE, 5, this.SIZE);
    this.hands[6].drawHand(ctx, this.BASE_X + (75 + this.X_OFFSET) * this.SIZE, this.BASE_Y + 2 * (100 + this.Y_OFFSET) * this.SIZE, 5, this.SIZE);
    this.hands[7].drawHand(ctx, this.BASE_X + 2 * (75 + this.X_OFFSET) * this.SIZE, this.BASE_Y + 2 * (100 + this.Y_OFFSET) * this.SIZE, 5, this.SIZE);
    
    // Main supplémentaire (position spéciale)
    this.hands[4].drawHand(ctx, this.BASE_X + 2 * (75 + this.X_OFFSET) * this.SIZE, this.BASE_Y + (100 + this.Y_OFFSET) * this.SIZE, 5, this.SIZE);
    
    // Main interactive
    this.hands[8].isolate = true;
    this.hands[8].drawHand(ctx, this.INTERACTIVE_X, this.INTERACTIVE_Y, 5, this.SIZE, this.selectedTile);
  }
  
  /**
   * Vérifie et affiche les informations sur les groupes formés
   */
  private checkAndDisplayGroups(): void {
    const groups = this.hands[8].toGroup();
    if (groups !== undefined) {
      this.staticCtx.fillStyle = "#FF0000";
      this.staticCtx.font = "50px serif";
      this.staticCtx.fillText("Tous les groupes sont formés !", 100, 750);
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
   * Initialise les écouteurs d'événements
   */
  private initEventListeners(): void {
    const mouseMoveHandler = this.handleMouseMove.bind(this);
    const mouseDownHandler = this.handleMouseDown.bind(this);
    
    this.canvas.addEventListener('mousemove', mouseMoveHandler);
    this.canvas.addEventListener('mousedown', mouseDownHandler);
    
    // Enregistrer les callbacks de nettoyage
    this.cleanupCallbacks.push(() => {
      this.canvas.removeEventListener('mousemove', mouseMoveHandler);
      this.canvas.removeEventListener('mousedown', mouseDownHandler);
    });
  }
  
  /**
   * Gère le mouvement de la souris
   */
  private handleMouseMove(e: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Sauvegarde de l'état précédent pour détecter les changements
    const previousSelectedTile = this.selectedTile;
    this.selectedTile = undefined;
    
    // Détection optimisée avec zones pré-calculées
    for (let i = 0; i < this.tileRects.length; i++) {
      const tileRect = this.tileRects[i];
      if (
        mouseX >= tileRect.x && 
        mouseX <= tileRect.x + tileRect.width && 
        mouseY >= tileRect.y && 
        mouseY <= tileRect.y + tileRect.height
      ) {
        this.selectedTile = i;
        break;
      }
    }
    
    // Marquer comme "dirty" uniquement si la sélection a changé
    if (previousSelectedTile !== this.selectedTile) {
      this.isDirty = true;
    }
  }
  
  /**
   * Gère le clic de souris
   */
  private handleMouseDown(): void {
    if (this.selectedTile !== undefined) {
      // Exécuter l'action pour la tuile sélectionnée
      this.decks[0].push(this.hands[8].eject(this.selectedTile));
      this.decks[0].shuffle();
      this.hands[8].sort();
      this.hands[8].push(this.decks[0].pop());
      
      // Marquer comme "dirty" pour forcer le redessinage
      this.isDirty = true;
    }
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
   * Initialise l'affichage et démarre l'application
   */
  public async initialize(): Promise<void> {
    try {
      // Création du deck principal
      this.decks.push(new Deck(false));
      
      // Création des mains prédéfinies
      this.hands.push(
        new Hand("s1s2s3"),         // Chii 1
        new Hand("m2m3m4"),         // Chii 2
        new Hand("p5p5p5"),         // Pon 1
        new Hand("w2w2w2"),         // Pon 2
        new Hand("d3d3d3"),         // Pon supplémentaire
        new Hand("s4p5m6"),         // Invalide 1
        new Hand("m9s9p9"),         // Invalide 2
        new Hand("d1d2d3"),         // Invalide 3
        this.decks[0].getRandomHand() // Main interactive
      );
      
      // Préchargement parallèle des ressources
      await Promise.all([
        ...this.decks.map(deck => this.preloadDeck(deck)),
        ...this.hands.map(hand => this.preloadHand(hand))
      ]);
      
      // Configuration de la main interactive
      this.hands[8].push(this.decks[0].pop());
      this.hands[8].sort();
      
      // Initialisation des écouteurs d'événements
      this.initEventListeners();
      
      // Premier rendu
      this.isDirty = true;
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
    this.decks.forEach(deck => deck.cleanup());
    this.hands.forEach(hand => hand.cleanup());
    
    // Vider les collections
    this.decks = [];
    this.hands = [];
    
    // Effacer les canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.staticCtx.clearRect(0, 0, this.staticCanvas.width, this.staticCanvas.height);
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
