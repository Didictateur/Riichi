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

class RiichiGameManagerDP8 {
  private readonly CANVAS_ID: string = "myCanvas";
  private readonly BG_RECT = { x: 0, y: 0, w: 1050, h: 1050 };
  private readonly FPS: number = 60;
  private readonly FRAME_INTERVAL: number = 1000 / this.FPS;

  private static instance: RiichiGameManagerDP8;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private staticCanvas: HTMLCanvasElement;
  private staticCtx: CanvasRenderingContext2D;

  private mouse = { x: 0, y: 0 };
  private game: Game | null = null;
  private decks: Array<Deck> = [];
  private hands: Array<Hand> = [];

  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;
  private isInitialized: boolean = false;

  private cleanupCallbacks: Array<() => void> = [];

  private constructor() {
    const canvas = document.getElementById(this.CANVAS_ID) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error(`Canvas with ID '${this.CANVAS_ID}' not found`);
    }
    this.canvas = canvas;
    this.canvas.width = this.BG_RECT.w;
    this.canvas.height = this.BG_RECT.h;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) {
      throw new Error("Unable to get 2D context");
    }
    this.ctx = ctx;

    this.staticCanvas = document.createElement('canvas');
    this.staticCanvas.width = canvas.width;
    this.staticCanvas.height = canvas.height;

    const staticCtx = this.staticCanvas.getContext("2d", { alpha: false });
    if (!staticCtx) {
      throw new Error("Unable to get static context");
    }
    this.staticCtx = staticCtx;
  }

  public static getInstance(): RiichiGameManagerDP8 {
    if (!RiichiGameManagerDP8.instance) {
      RiichiGameManagerDP8.instance = new RiichiGameManagerDP8();
    }
    return RiichiGameManagerDP8.instance;
  }

  private drawFrame(): void {
    if (this.game) {
      this.game.draw(this.mouse);

      // If game finished and yakus enabled, draw the detected yakus on the left
      if (this.game.isFinished()) {
        const yakus = this.game.getLastYakus();
        const total = this.game.getLastTotalHan();
        if (yakus && yakus.length > 0) {
          const ctx = this.staticCtx;
          ctx.save();
          ctx.fillStyle = 'rgba(0,0,0,0.6)';
          ctx.fillRect(20, 60, 300, 24 + yakus.length * 24 + 30);
          ctx.fillStyle = '#ffffff';
          ctx.font = '18px garamond';
          ctx.fillText('Yakus detected:', 30, 86);
          for (let i = 0; i < yakus.length; i++) {
            const y = 110 + i * 24;
            ctx.fillText(`${yakus[i].name} (${yakus[i].han})`, 30, y);
          }
          ctx.fillText(`Total han: ${total}`, 30, 110 + yakus.length * 24 + 8);
          ctx.restore();

          // Blit to visible canvas
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          this.ctx.drawImage(this.staticCanvas, 0, 0);
        }
      }
    }
  }

  private startAnimationLoop(): void {
    const animationLoop = (currentTime: number) => {
      this.animationFrameId = requestAnimationFrame(animationLoop);
      const deltaTime = currentTime - this.lastFrameTime;
      if (deltaTime < this.FRAME_INTERVAL) return;
      this.lastFrameTime = currentTime - (deltaTime % this.FRAME_INTERVAL);
      this.drawFrame();
    };
    this.animationFrameId = requestAnimationFrame(animationLoop);
  }

  private initEventListeners(): void {
    const mouseMoveHandler = (e: MouseEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    };

    const mouseDownHandler = (e: MouseEvent) => {
      if (this.game) this.game.click(e as any);
    };

    this.canvas.addEventListener('mousemove', mouseMoveHandler);
    this.canvas.addEventListener('mousedown', mouseDownHandler);

    this.cleanupCallbacks.push(() => {
      this.canvas.removeEventListener('mousemove', mouseMoveHandler);
      this.canvas.removeEventListener('mousedown', mouseDownHandler);
    });
  }

  private async preloadDeck(deck: Deck): Promise<void> {
    await deck.preload();
  }

  private async preloadHand(hand: Hand): Promise<void> {
    await hand.preload();
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Create the game with yakus enabled (dp8)
      this.game = new Game(
        this.ctx,
        this.canvas,
        this.staticCtx,
        this.staticCanvas,
        false,
        8,
        Math.floor(Math.random() * 4),
        true // enableYakus
      );

      await Promise.all([
        ...this.decks.map(d => this.preloadDeck(d)),
        ...this.hands.map(h => this.preloadHand(h)),
        this.game.preload()
      ]);

      this.initEventListeners();
      this.startAnimationLoop();
      this.isInitialized = true;
      (window as any).cleanup = this.cleanup.bind(this);
    } catch (e) {
      console.error('Initialization error dp8', e);
    }
  }

  public cleanup(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.cleanupCallbacks.forEach(cb => cb());
    this.cleanupCallbacks = [];
    if (this.game) (this.game as any).cleanup?.();
    this.game = null;
    this.decks.forEach(d => d.cleanup());
    this.hands.forEach(h => h.cleanup());
    this.decks = [];
    this.hands = [];
    this.isInitialized = false;
    this.lastFrameTime = 0;
    this.mouse = { x: 0, y: 0 };
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.staticCtx.clearRect(0, 0, this.staticCanvas.width, this.staticCanvas.height);
  }
}

export function cleanup(): void {
  RiichiGameManagerDP8.getInstance().cleanup();
}

export async function initDisplay(): Promise<void> {
  await RiichiGameManagerDP8.getInstance().initialize();
}

declare global {
  interface Window {
    cleanup: () => void;
  }
}

if (typeof window !== 'undefined') {
  showPlayButton();
}
