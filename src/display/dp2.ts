import { Deck } from "../deck";
import { Hand } from "../hand";

declare global {
    interface Window {
        cleanup: () => void;
    }
}

export {};

class RiichiDisplay {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private offScreenCanvas: HTMLCanvasElement;
    private offScreenCtx: CanvasRenderingContext2D;
    
    private deck: Deck;
    private hands: Hand[] = [];
    private edeck: Deck;
    private ehand: Hand;
    
    private selectedTile: number | undefined = undefined;
    private animationFrameId: number | null = null;
    private isDirty: boolean = true;
    
    // Constants
    private readonly FPS: number = 30;
    private readonly INTERVAL: number = 1000 / this.FPS;
    private readonly X: number = 100;
    private readonly Y: number = 150;
    private readonly OS: number = 75;
    private readonly SIZE: number = 0.75;
    private readonly TILE_WIDTH: number = 80 * this.SIZE;
    private readonly MAX_TILES: number = 14;
    
    // Cache for mouse hit detection
    private tileRects: Array<{x: number, y: number, width: number, height: number}> = [];
    
    constructor() {
        const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
        if (!canvas) {
            throw new Error("Canvas introuvable dans le DOM.");
        }
        
        this.canvas = canvas;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            throw new Error("Impossible d'obtenir le contexte du canvas.");
        }
        this.ctx = ctx;
        
        // Create off-screen canvas for double buffering
        this.offScreenCanvas = document.createElement('canvas');
        this.offScreenCanvas.width = canvas.width;
        this.offScreenCanvas.height = canvas.height;
        const offCtx = this.offScreenCanvas.getContext('2d');
        if (!offCtx) {
            throw new Error("Impossible d'obtenir le contexte du canvas hors écran.");
        }
        this.offScreenCtx = offCtx;
        
        // Initialize decks
        this.deck = new Deck(false);
        this.edeck = new Deck(false);
        
        // Initialize with empty hand (will be populated after preload)
        this.ehand = new Hand();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Calculate tile hit areas once
        this.calculateTileHitAreas();
    }
    
    private calculateTileHitAreas(): void {
        this.tileRects = [];
        for (let i = 0; i < this.MAX_TILES; i++) {
            this.tileRects.push({
                x: this.X + i * this.TILE_WIDTH,
                y: 800,
                width: 75,
                height: 100 * this.SIZE
            });
        }
    }
    
    private setupEventListeners(): void {
        this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
        this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    }
    
    private handleMouseMove(event: MouseEvent): void {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        
        // Check if cursor is over any tile using pre-calculated hit areas
        const oldSelectedTile = this.selectedTile;
        this.selectedTile = undefined;
        
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
        
        // Only mark as dirty if selection changed
        if (oldSelectedTile !== this.selectedTile) {
            this.isDirty = true;
        }
    }
    
    private handleMouseDown(): void {
        if (this.selectedTile !== undefined) {
            this.edeck.push(this.ehand.eject(this.selectedTile));
            this.edeck.shuffle();
            this.ehand.sort();
            this.ehand.push(this.edeck.pop());
            this.isDirty = true;
        }
    }
    
    public async initialize(): Promise<void> {
        // Preload all assets in parallel
        await Promise.all([
            this.deck.preload(),
            this.edeck.preload()
        ]);
        
        // Generate sample hands
        for (let i = 0; i < 4; i++) {
            const hand = this.deck.getRandomHand();
            hand.sort();
            this.hands.push(hand);
        }
        
        // Initialize interactive hand
        this.ehand = this.edeck.getRandomHand();
        this.ehand.push(this.edeck.pop());
        this.ehand.sort();
        
        // Initial draw
        this.drawCanvas();
        
        // Start animation loop
        this.startAnimationLoop();
    }
    
    private drawCanvas(): void {
        // Only redraw if something changed (dirty flag)
        if (!this.isDirty) return;
        
        const ctx = this.offScreenCtx;
        
        // Clear canvas
        ctx.clearRect(0, 0, this.offScreenCanvas.width, this.offScreenCanvas.height);
        
        // Draw background
        ctx.fillStyle = "#007730";
        ctx.fillRect(50, 50, 1000, 1000);
        
        // Draw title
        ctx.fillStyle = "#DFDFFF";
        ctx.font = "50px serif";
        ctx.fillText("Exemples de main:", 65, 100);
        
        // Draw example hands
        for (let i = 0; i < this.hands.length; i++) {
            this.hands[i].drawHand(
                ctx, 
                this.X, 
                this.Y + i * this.SIZE * (100 + this.OS), 
                5, 
                this.SIZE
            );
        }
        
        // Draw interactive hand
        this.ehand.isolate = true;
        this.ehand.drawHand(
            ctx, 
            this.X, 
            800, 
            5, 
            this.SIZE, 
            this.selectedTile
        );
        
        // Flip double buffer
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.offScreenCanvas, 0, 0);
        
        // Reset dirty flag
        this.isDirty = false;
    }
    
    private startAnimationLoop(): void {
        let lastTime = 0;
        
        const animationLoop = (currentTime: number) => {
            const deltaTime = currentTime - lastTime;
            
            if (deltaTime >= this.INTERVAL) {
                lastTime = currentTime - (deltaTime % this.INTERVAL);
                this.drawCanvas();
            }
            
            this.animationFrameId = requestAnimationFrame(animationLoop);
        };
        
        this.animationFrameId = requestAnimationFrame(animationLoop);
    }
    
    public cleanup(): void {
        // Cancel animation loop
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        // Clean up resources
        this.deck.cleanup();
        this.hands.forEach(hand => hand.cleanup());
        this.hands = [];
        this.edeck.cleanup();
        this.ehand.cleanup();
        
        // Clear canvases
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.offScreenCtx.clearRect(0, 0, this.offScreenCanvas.width, this.offScreenCanvas.height);
        
        // Reset state
        this.selectedTile = undefined;
        this.isDirty = true;
    }
}

// Initialize and start
const riichiDisplay = new RiichiDisplay();
riichiDisplay.initialize().catch(error => {
    console.error("Erreur lors de l'initialisation:", error);
});

// Expose cleanup function for window
window.cleanup = () => {
    riichiDisplay.cleanup();
};
