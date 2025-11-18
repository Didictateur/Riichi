import { Deck } from "./deck";
import { Hand } from "./hand";
import { Tile } from "./tile";
import { Group } from "./group";
import { drawButtons, clickAction, drawChiis, clickChii } from "./button";
import { drawState } from "./state";
import { yakus } from "./yakus/yaku";

export type MousePos = { x: number, y: number };

// Game constants to avoid magic numbers and improve readability
const GAME_CONSTANTS = {
  PLAYERS: 4,
  BACKGROUND: { color: "#007730", x: 0, y: 0, w: 1050, h: 1050 },
  DEAD_WALL_SIZE: 14,
  WAITING_TIME: {
    MIN: 500,
    MAX: 2000,
    DEFAULT: 700
  },
  DISPLAY: {
    HAND_SIZE: 0.7,
    HIDDEN_HAND_SIZE: 0.6,
    DISCARD_SIZE: 0.6,
    GROUP_SIZE: 0.6
  },
  PI: Math.PI
};

export class Game {
  private deck: Deck;
  private deadWall: Array<Tile> = [];
  private hands: Array<Hand> = [];
  private discards: Array<Array<Tile>> = [];
  private lastDiscard: number | undefined;
  private groups: Array<Array<Group>> = [];
  
  // Game state
  private level: number;
  private turn = 0;
	private windPlayer: number;
  private waitingTime = GAME_CONSTANTS.WAITING_TIME.DEFAULT;
  private selectedTile: number | undefined = undefined;
  private canCall: boolean = false;
  private declaredRiichi: boolean[] = [];
  // Version counters to detect when a hand changed (to avoid recomputing expensive sims every frame)
  private handVersion: number[] = [];
  // Tenpai cache per player
  private tenpaiCache: boolean[] = [];
  private tenpaiCacheVersion: number[] = [];
  // canRon cache for player 0 relative to lastDiscard
  private canRonCache: { lastDiscard?: number; handVer?: number; result: boolean } = { result: false };
  private hasPicked: boolean = false;
  private hasPlayed: boolean = false;
  private lastPlayed: number = Date.now();
  private chooseChii: boolean = false;
  private end: boolean = false;
  private result: number = -1;
  
  // Canvas elements
  private ctx: CanvasRenderingContext2D;
  private cv: HTMLCanvasElement;
  private staticCtx: CanvasRenderingContext2D;
  private staticCv: HTMLCanvasElement;
  
  // Cached values to avoid recalculations
  private readonly BG_RECT = GAME_CONSTANTS.BACKGROUND;
  private readonly rotations = [0, -GAME_CONSTANTS.PI / 2, -GAME_CONSTANTS.PI, GAME_CONSTANTS.PI / 2];

  // When enableYakus is true the game will evaluate yakus on any win and
  // store the detected yakus for display.
  constructor(
    ctx: CanvasRenderingContext2D,
    cv: HTMLCanvasElement,
    staticCtx: CanvasRenderingContext2D,
    staticCv: HTMLCanvasElement,
    red: boolean = false,
    level: number = 0,
    windPlayer: number = 0,
    private enableYakus: boolean = false
  ) {
    this.ctx = ctx;
    this.cv = cv;
    this.staticCtx = staticCtx;
    this.staticCv = staticCv;
    this.level = level;
		this.windPlayer = windPlayer;
		this.turn = windPlayer % 2 === 0 ? windPlayer : 4 - windPlayer;
    
    // Initialize game elements
    this.deck = new Deck(red);
    this.initializeGame();
  }

  private drawDynamic(ctx: CanvasRenderingContext2D): void {
    // Redraw player's hand on top to show focused tile
    const { HAND_SIZE } = GAME_CONSTANTS.DISPLAY;
    this.hands[0].drawHand(
      ctx,
      2.5 * 75 * 0.75,
      1000 - 150 * HAND_SIZE,
      5 * HAND_SIZE,
      0.75,
      this.selectedTile,
      false,
      0
    );

    // If a tile is selected, highlight matching discarded tiles
    if (this.selectedTile !== undefined) {
      const highlighted = this.hands[0].get(this.selectedTile) as Tile;
      const sizeDiscard = GAME_CONSTANTS.DISPLAY.DISCARD_SIZE;
      for (let p = 0; p < GAME_CONSTANTS.PLAYERS; p++) {
        const d = this.discards[p];
        if (!d || d.length === 0) continue;
        ctx.save();
        ctx.translate(525, 525);
        ctx.rotate(this.rotations[p]);
        for (let i = 0; i < d.length; i++) {
          const tile = d[i];
          if (!highlighted.isEqual(tile.getFamily(), tile.getValue())) continue;
          let tx, ty;
          if (i < 12) {
            tx = -sizeDiscard * 475 / 2 + (i % 6) * 80 * sizeDiscard;
            ty = sizeDiscard * (475 / 2 + 5) + Math.floor(i / 6) * 105 * sizeDiscard;
          } else {
            tx = -sizeDiscard * 475 / 2 + (i - 12) * 80 * sizeDiscard;
            ty = sizeDiscard * (475 / 2 + 5) + 2 * 105 * sizeDiscard;
          }
          // Draw highlighted version on top
          tile.drawTile(ctx, tx, ty, sizeDiscard, false, 0, true);
        }
        ctx.restore();
      }
    }

    // Draw call buttons / chiis on top
    if (this.chooseChii) {
      drawChiis(ctx, this.getChii(0));
    } else {
      const canTsumoLocal = this.hasPicked && this.hasWin(0) && (!this.enableYakus || this.handHasAnyYaku(this.hands[0], this.groups[0]));
      let canRonLocal = false;
      if (this.lastDiscard !== undefined && this.lastDiscard !== 0) {
        if (this.canRonCache.lastDiscard === this.lastDiscard && this.canRonCache.handVer === this.handVersion[0]) {
          canRonLocal = this.canRonCache.result;
        } else {
          const d = this.discards[this.lastDiscard];
          if (d && d.length > 0) {
            const last = d[d.length - 1];
            const sim = new Hand();
            for (const t of this.hands[0].getTiles()) {
              sim.push(new Tile(t.getFamily(), t.getValue(), t.isRed()));
            }
            sim.push(new Tile(last.getFamily(), last.getValue(), last.isRed()));
            sim.sort();
            const simGroups = sim.toGroup() as Array<Group> | undefined;
            const combinedGroups = this.groups[0].concat(simGroups ? simGroups : []);
            canRonLocal = sim.toGroup() !== undefined && (!this.enableYakus || this.handHasAnyYaku(sim, combinedGroups));
          } else {
            canRonLocal = false;
          }
          this.canRonCache = { lastDiscard: this.lastDiscard, handVer: this.handVersion[0], result: canRonLocal };
        }
      }

      const canRiichiLocal = this.canDeclareRiichi(0);
      drawButtons(
        ctx,
        this.canDoAChii().length > 0,
        this.canDoAPon(),
        false && this.level > 1,
        canRonLocal,
        canTsumoLocal,
        canRiichiLocal
      );
    }
  }

  // Last detected yakus for the most recent win (player index => list)
  private lastYakus: Array<{ name: string; han: number }> = [];
  private lastTotalHan: number = 0;
  // Static/dynamic rendering optimization: when true we redraw the static buffer
  private staticDirty: boolean = true;

  /**
   * Compute yakus for a given player and populate lastYakus/lastTotalHan.
   * This uses the exported `yakus` table where each entry returns han (0 if not present).
   */
  private computeYakusForPlayer(player: number): void {
    this.lastYakus = [];
    this.lastTotalHan = 0;

    try {
      const hand = this.hands[player];
      const groups = this.groups[player] || [];

      for (const k of Object.keys(yakus)) {
        // Call each yaku detector with (hand, groups, wind)
        // Some detector functions expect the player's wind as an index
        const fn = (yakus as any)[k];
        try {
          const han = fn(hand, groups, this.windPlayer);
          if (han && han > 0) {
            this.lastYakus.push({ name: k, han });
            this.lastTotalHan += han;
          }
        } catch (e) {
          // Ignore errors in any individual detector to avoid breaking the flow
          console.warn(`Yaku ${k} threw:`, e);
        }
      }
    } catch (e) {
      console.warn("Failed to compute yakus:", e);
      this.lastYakus = [];
      this.lastTotalHan = 0;
    }
  }

  private resolveWin(player: number, resultCode: number, fromPlayer?: number): void {
    if (this.enableYakus) {
      this.computeYakusForPlayer(player);
    } else {
      this.lastYakus = [];
      this.lastTotalHan = 0;
    }

    this.end = true;
    this.result = resultCode;
    this.staticDirty = true;
  }

  /**
   * Check whether a given hand (possibly simulated) yields at least one yaku.
   * Does not modify `lastYakus`/`lastTotalHan` — only inspects using yakus detectors.
   */
  private handHasAnyYaku(hand: Hand, groups: Array<Group> = []): boolean {
    try {
      for (const k of Object.keys(yakus)) {
        const fn = (yakus as any)[k];
        try {
          const han = fn(hand, groups, this.windPlayer);
          if (han && han > 0) return true;
        } catch (e) {
          // ignore detector errors
        }
      }
    } catch (e) {
      // ignore
    }
    return false;
  }

  /**
   * Return full list of yakus for a given hand+groups (doesn't mutate state)
   */
  private getYakusForHand(hand: Hand, groups: Array<Group> = []): Array<{ name: string; han: number }> {
    const res: Array<{ name: string; han: number }> = [];
    try {
      for (const k of Object.keys(yakus)) {
        const fn = (yakus as any)[k];
        try {
          const han = fn(hand, groups, this.windPlayer);
          if (han && han > 0) res.push({ name: k, han });
        } catch (e) {
          // ignore individual detector errors
        }
      }
    } catch (e) {
      // ignore
    }
    return res;
  }

  // Helper: human-readable tile label for logging
  private formatTile(t: Tile): string {
    const fam = t.getFamily();
    const val = t.getValue();
    if (fam >= 1 && fam <= 3) {
      const names = ["", "Man", "Pin", "Sou"];
      return `${names[fam]}${val}${t.isRed() ? "(r)" : ""}`;
    }
    if (fam === 4) {
      const winds = ["", "Ton", "Nan", "Shaa", "Pei"];
      return winds[val];
    }
    if (fam === 5) {
      const dr = ["", "Chun", "Hatsu", "Haku"];
      return dr[val];
    }
    return `F${fam}V${val}`;
  }

  private initializeGame(): void {
    this.deck.shuffle();
    
    // Set up dead wall
    for (let i = 0; i < GAME_CONSTANTS.DEAD_WALL_SIZE; i++) {
      this.deadWall.push(this.deck.pop());
    }
    
    // Create player hands
    for (let i = 0; i < GAME_CONSTANTS.PLAYERS; i++) {
      this.hands.push(this.deck.getRandomHand());
      this.discards.push([]);
      this.groups.push([]);
      this.declaredRiichi.push(false);
      this.handVersion.push(0);
      this.tenpaiCache.push(false);
      this.tenpaiCacheVersion.push(-1);
    }
    
    this.lastDiscard = undefined;
    this.hands[0].sort();
    if (this.turn === 0) this.pick(0);
    this.staticDirty = true;
  }

  public draw(mp: MousePos): void {
    // Update selection and game state
    this.getSelected(mp);
    this.play();

    // Rebuild static buffer only when needed
    if (this.staticDirty) {
      this.staticCtx.clearRect(0, 0, this.cv.width, this.cv.height);
      // Draw background
      this.staticCtx.fillStyle = this.BG_RECT.color;
      this.staticCtx.fillRect(
        this.BG_RECT.x,
        this.BG_RECT.y,
        this.BG_RECT.w,
        this.BG_RECT.h
      );

      // Draw mostly-static elements
      drawState(this.staticCtx, this.turn, GAME_CONSTANTS.PI / 2 * this.windPlayer);
      this.drawDiscardSize();
      this.drawResult();
      // Draw hands without focused (focused tile rendered in dynamic overlay)
      const showHands = false;
      const { HAND_SIZE, HIDDEN_HAND_SIZE } = GAME_CONSTANTS.DISPLAY;
      this.hands[0].drawHand(
        this.staticCtx,
        2.5 * 75 * 0.75,
        1000 - 150 * HAND_SIZE,
        5 * HAND_SIZE,
        0.75,
        undefined,
        false,
        0,
        this.selectedTile
      );
      this.hands[1].drawHand(
        this.staticCtx,
        1000 - 150 * HIDDEN_HAND_SIZE,
        1000 - 75 * 5 * HIDDEN_HAND_SIZE,
        5 * HIDDEN_HAND_SIZE,
        HIDDEN_HAND_SIZE,
        undefined,
        !showHands,
        -GAME_CONSTANTS.PI / 2
      );
      this.hands[2].drawHand(
        this.staticCtx,
        1000 - 75 * 5 * HIDDEN_HAND_SIZE,
        150 * HIDDEN_HAND_SIZE,
        5 * HIDDEN_HAND_SIZE,
        HIDDEN_HAND_SIZE,
        undefined,
        !showHands,
        -GAME_CONSTANTS.PI
      );
      this.hands[3].drawHand(
        this.staticCtx,
        150 * HIDDEN_HAND_SIZE,
        75 * 5 * HIDDEN_HAND_SIZE,
        5 * HIDDEN_HAND_SIZE,
        HIDDEN_HAND_SIZE,
        undefined,
        !showHands,
        GAME_CONSTANTS.PI / 2
      );

      // Draw groups and discards (no per-frame highlights)
      this.drawGroups(GAME_CONSTANTS.DISPLAY.GROUP_SIZE);
      for (let i = 0; i < GAME_CONSTANTS.PLAYERS; i++) {
        this.drawDiscard(i, undefined);
      }

      this.staticDirty = false;
    }

    // Blit static buffer
    this.ctx.clearRect(0, 0, this.cv.width, this.cv.height);
    this.ctx.drawImage(this.staticCv, 0, 0);

    // Draw dynamic overlay: selection, highlights, buttons, chiis
    this.drawDynamic(this.ctx);
  }

  public getDeck(): Deck {
    return this.deck;
  }

  public getHands(): Array<Hand> {
    return this.hands;
  }

  public isFinished(): boolean {
    return this.end;
  }

  public click(mp: MousePos): void {
    const rect = this.cv.getBoundingClientRect();
    
    if (this.hasWin(0) && (!this.enableYakus || this.handHasAnyYaku(this.hands[0], this.groups[0]))) {
      this.resolveWin(0, 1);
      return;
    }
    
    if (this.chooseChii) {
      this.handleChiiSelection(mp, rect);
      return;
    }
    
    // Determine if Ron/Tsumo should be available for player 0
    const canTsumo = this.hasPicked && this.hasWin(0) && (!this.enableYakus || this.handHasAnyYaku(this.hands[0], this.groups[0]));
    let canRon = false;
    if (this.lastDiscard !== undefined && this.lastDiscard !== 0) {
      const d = this.discards[this.lastDiscard];
      if (d && d.length > 0) {
        const last = d[d.length - 1];
        const sim = new Hand();
        for (const t of this.hands[0].getTiles()) {
          sim.push(new Tile(t.getFamily(), t.getValue(), t.isRed()));
        }
        sim.push(new Tile(last.getFamily(), last.getValue(), last.isRed()));
        sim.sort();
  const simGroups = sim.toGroup() as Array<Group> | undefined;
  const combinedGroups = this.groups[0].concat(simGroups ? simGroups : []);
  canRon = sim.toGroup() !== undefined && (!this.enableYakus || this.handHasAnyYaku(sim, combinedGroups));
      }
    }

    const canRiichi = this.canDeclareRiichi(0);
    const action = clickAction(
      mp.x - rect.x,
      mp.y - rect.y,
      this.canDoAChii().length > 0,
      this.canDoAPon(),
      false && this.level > 1,
      canRon,
      canTsumo,
      canRiichi
    );
    
    if (this.canCall && action !== -1) {
      this.handleCallAction(action);
    } else if (action === 6) { // Riichi action
      if (canRiichi) {
        this.declareRiichi(0);
      }
    } else if (this.turn === 0 && this.selectedTile !== undefined) {
      this.handlePlayerDiscard();
    }
  }

  private handleChiiSelection(mp: MousePos, rect: DOMRect): void {
    const allChii = this.getChii(0);
    const selection = clickChii(
      mp.x - rect.x,
      mp.y - rect.y,
      allChii
    );
    
    if (selection === 0) {
      this.chooseChii = false;
    } else {
      this.chooseChii = false;
      this.chii(selection, 0);
    }
  }

  private handleCallAction(action: number): void {
    if (action === 0) { // Pass
      this.canCall = false;
      this.advanceTurn();
    } else if (action === 1) { // Chii
      const chiis = this.canDoAChii();
      if (chiis.length === 1) {
        this.chii(chiis[0], 0);
        } else {
        this.chooseChii = true;
        this.staticDirty = true;
      }
    } else if (action === 2) { // Pon
      this.pon(this.turn);
    }
  }

  private handlePlayerDiscard(): void {
    this.discard(0, this.selectedTile as number);
    
    if (!this.checkPon()) {
      const chiis = this.canDoAChii(1);
      if (chiis.length > 0) {
        const i = Math.floor(Math.random() * chiis.length);
        this.chii(chiis[i], 1);
      } else {
        this.advanceTurn();
      }
    }
  }

  private advanceTurn(): void {
    this.updateWaitingTime();
    this.turn = (this.turn + 1) % GAME_CONSTANTS.PLAYERS;
		this.pick(this.turn);
    this.hasPicked = true;
    this.hasPlayed = false;
  }

  private getSelected(mp: MousePos): void {
    const rect = this.cv.getBoundingClientRect();
    const x = 2.5 * 75 * 0.75;
    const y = 1050 - 250 * 0.6;
    const sizeHand = GAME_CONSTANTS.DISPLAY.HAND_SIZE;
    
    const mouseX = mp.x - x;
    const mouseY = mp.y;
    const tileWidth = 83.9;
    
    const tileIndex = Math.floor(mouseX / (tileWidth * sizeHand));
    const relativeX = mouseX - tileIndex * tileWidth * sizeHand;
    // Determine whether selection changed and only mark static buffer dirty
    // when it did. This prevents ghosting where the static layer still
    // contains the tile at its original position while the dynamic layer
    // draws the lifted tile.
    const inBounds = (
      relativeX <= (tileWidth - 3) * sizeHand &&
      tileIndex >= 0 &&
      tileIndex < this.hands[0].length() &&
      mouseY >= y &&
      mouseY <= y + 100 * sizeHand
    );

    const newSelected = inBounds ? tileIndex : undefined;
    if (newSelected !== this.selectedTile) {
      this.selectedTile = newSelected;
      // Force static buffer rebuild so the static hand skips drawing the
      // selected tile (we pass skipIndex when drawing static hand).
      this.staticDirty = true;
    }
  }

  private updateWaitingTime(): void {
    this.waitingTime = Math.floor(
      Math.random() * 
      (GAME_CONSTANTS.WAITING_TIME.MAX - GAME_CONSTANTS.WAITING_TIME.MIN) + 
      GAME_CONSTANTS.WAITING_TIME.MIN
    );
  }

  private play(): void {
    if (this.turn !== 0 && !this.end) {
      if (!this.hasPicked) {
        // Begin of turn
        this.lastPlayed = Date.now();
        this.pick(this.turn);
        this.hasPicked = true;
      } else if (!this.hasPlayed) {
        // Middle of turn
        this.handleBotTurn();
      } else if (!this.canCall) {
        // End of turn
        this.advanceBotTurn();
      }
    }
  }

  private handleBotTurn(): void {
    if (this.hasWin(this.turn) && (!this.enableYakus || this.handHasAnyYaku(this.hands[this.turn], this.groups[this.turn]))) {
      this.resolveWin(this.turn, 2);
      return;
    }
    
    if (Date.now() - this.lastPlayed > this.waitingTime) {
      this.lastPlayed = Date.now();
      
      // Choose random tile to discard
      const n = Math.floor(this.hands[this.turn].length() * Math.random());
      this.discard(this.turn, n);
      this.hasPlayed = true;

      if (this.deck.length() <= 0) {
        // Draw / no tiles left
        this.result = 0;
        this.end = true;
        return;
      }
      
      if (!this.end) {
        // If any player (including player 0) can Ron on this discard, open the call window
        const anyRon = this.canAnyPlayerRon(this.turn);
        if (anyRon) {
          this.canCall = true;
          return;
        }

        // Otherwise proceed with normal automatic pon/chii resolution
        this.checkPon();
        this.checkForChii();
        this.canCall = this.canDoAChii().length > 0 || this.canDoAPon();
      }
    }
  }

  /**
   * Check if any other player can Ron on the last discard performed by discardPlayer.
   * This builds a simulated hand for each candidate player to avoid mutating state.
   */
  private canAnyPlayerRon(discardPlayer: number): boolean {
    const d = this.discards[discardPlayer];
    if (!d || d.length === 0) return false;
    const last = d[d.length - 1];

    for (let p = 0; p < GAME_CONSTANTS.PLAYERS; p++) {
      if (p === discardPlayer) continue;
      const sim = new Hand();
      for (const t of this.hands[p].getTiles()) {
        sim.push(new Tile(t.getFamily(), t.getValue(), t.isRed()));
      }
      sim.push(new Tile(last.getFamily(), last.getValue(), last.isRed()));
      sim.sort();
  const simGroups = sim.toGroup() as Array<Group> | undefined;
  const combinedGroups = this.groups[p].concat(simGroups ? simGroups : []);
  if (sim.toGroup() !== undefined && (!this.enableYakus || this.handHasAnyYaku(sim, combinedGroups))) return true;
    }

    return false;
  }

  private checkForChii(): void {
    if (this.turn === 3) return;
    
    const nextPlayer = this.turn + 1;
    const chiis = this.canDoAChii(nextPlayer);
    
    if (chiis.length > 0) {
      const i = Math.floor(Math.random() * chiis.length);
      this.chii(chiis[i], nextPlayer);
    }
  }

  private advanceBotTurn(): void {
    if (this.turn === 3) {
      this.turn = 0;
      this.pick(0);
      if (this.hasWin(0) && (!this.enableYakus || this.handHasAnyYaku(this.hands[0], this.groups[0]))) {
        this.resolveWin(0, 1);
      }
    } else {
      this.turn++;
    }
    
    this.updateWaitingTime();
    this.hasPicked = false;
    this.hasPlayed = false;
  }

  private pick(player: number): void {
    this.hands[player].push(this.deck.pop());
    this.hands[player].isolate = true;
    // mark hand as changed
    this.handVersion[player] = (this.handVersion[player] || 0) + 1;
    this.tenpaiCacheVersion[player] = -1;
    // changing hand invalidates ron cache
    this.canRonCache = { result: false };
    this.staticDirty = true;
  }

  private discard(player: number, n: number): void {
    const tile = this.hands[player].eject(n);
    this.hands[player].sort();
    
    tile.setTilt();
    this.discards[player].push(tile);
    
    this.hands[player].isolate = false;
    this.hands[player].sort();
    
    this.lastDiscard = player;
    this.lastPlayed = Date.now();
    // mark hand as changed
    this.handVersion[player] = (this.handVersion[player] || 0) + 1;
    this.tenpaiCacheVersion[player] = -1;
    this.canRonCache = { result: false };
    this.staticDirty = true;
  }

  private canDoAChii(p: number = 0): Array<number> {
    const chii: number[] = [];
    
    // Check if chii is possible
    if (
      this.lastDiscard === undefined ||
      (this.lastDiscard + 1) % 4 !== p ||
      (this.turn + 1) % 4 !== p ||
      this.discards[this.lastDiscard][this.discards[this.lastDiscard].length - 1].getFamily() >= 4
    ) {
      return chii;
    }
    
    const t = this.discards[this.lastDiscard][this.discards[this.lastDiscard].length - 1];
    const h = this.hands[p];
    const family = t.getFamily();
    const value = t.getValue();
    
    // Check for three possible chii patterns
    if (h.count(family, value - 2) > 0 && h.count(family, value - 1) > 0) {
      chii.push(value - 2);
    }
    
    if (h.count(family, value - 1) > 0 && h.count(family, value + 1) > 0) {
      chii.push(value - 1);
    }
    
    if (h.count(family, value + 1) > 0 && h.count(family, value + 2) > 0) {
      chii.push(value);
    }
    
    return chii;
  }

  private chii(minValue: number, p: number): void {
    const discardPlayer = p === 0 ? 3 : p - 1;
    const t = this.discards[discardPlayer].pop() as Tile;
    this.lastDiscard = undefined;
    
    const tt: Tile[] = [];
    let tn = 0;
    let v = minValue;
    
    // Find the right tiles for the chii
    while (tn < 2) {
      if (v === t.getValue()) {
        v++;
      } else {
        tt[tn] = this.hands[p].find(t.getFamily(), v) as Tile;
        tn++;
        v++;
      }
    }
    
    // Set tilt for all tiles in the group
    [t, tt[0], tt[1]].forEach(tile => tile.setTilt());
    
    // Create new group
    this.groups[p].push(new Group([t, tt[0], tt[1]], discardPlayer, p));
    
    // mark hand changed for player p
    this.handVersion[p] = (this.handVersion[p] || 0) + 1;
    this.tenpaiCacheVersion[p] = -1;
    this.canRonCache = { result: false };

    if (this.hasWin(p) && (!this.enableYakus || this.handHasAnyYaku(this.hands[p], this.groups[p]))) {
      this.resolveWin(p, p === 0 ? 1 : 2);
    }
    
    this.updateWaitingTime();
    this.turn = p;
    this.hasPicked = true;
    this.hasPlayed = false;
  }

  private getChii(p: number): Array<Array<Tile>> {
    const chiis: Array<Array<Tile>> = [];
    const numChii = this.canDoAChii();
    const discardPlayer = p === 0 ? 3 : p - 1;
    const d = this.discards[discardPlayer];
    const t = d[d.length - 1];
    
    for (let i = 0; i < numChii.length; i++) {
      const v = numChii[i];
      const chii: Tile[] = [];
      
      for (let dv = 0; dv < 3; dv++) {
        if (v + dv === t.getValue()) {
          chii.push(t);
        } else {
          const tt = this.hands[p].find(t.getFamily(), v + dv) as Tile;
          chii.push(tt);
          this.hands[p].push(tt);
          this.hands[p].sort();
        }
      }
      
      chiis.push(chii);
    }
    
    return chiis;
  }

  private checkPon(): boolean {
    for (let p = 1; p < GAME_CONSTANTS.PLAYERS; p++) {
      if (this.canDoAPon(p)) {
        this.pon(this.lastDiscard as number, p);
        return true;
      }
    }
    return false;
  }

  private canDoAPon(player: number = 0): boolean {
    if (
      this.lastDiscard === undefined || 
      this.lastDiscard === player || 
      this.turn === player ||
      (this.hasPicked && !this.hasPlayed)
    ) {
      return false;
    }
    
    const t = this.discards[this.lastDiscard][this.discards[this.lastDiscard].length - 1];
    return this.hands[player].count(t.getFamily(), t.getValue()) >= 2;
  }

  /**
   * Check whether the given player's closed hand is in tenpai (waiting).
   * We simulate adding any possible tile and check if it yields a winning hand.
   */
  private isTenpai(player: number): boolean {
    // Use cached result when hand hasn't changed
    if (this.tenpaiCacheVersion[player] === this.handVersion[player]) {
      return this.tenpaiCache[player];
    }

    const h = this.hands[player];
    // quick guard: hand should not already be winning
    if (h.toGroup() !== undefined) {
      this.tenpaiCache[player] = false;
      this.tenpaiCacheVersion[player] = this.handVersion[player];
      return false;
    }

    // Try all possible tile types
    // suits 1..3 values 1..9
    for (let fam = 1; fam <= 3; fam++) {
      for (let val = 1; val <= 9; val++) {
        const sim = new Hand();
        for (const t of h.getTiles()) {
          sim.push(new Tile(t.getFamily(), t.getValue(), t.isRed()));
        }
        sim.push(new Tile(fam, val, false));
        sim.sort();
        if (sim.toGroup() !== undefined) {
          this.tenpaiCache[player] = true;
          this.tenpaiCacheVersion[player] = this.handVersion[player];
          return true;
        }
        // also try red five
        if (val === 5) {
          const simR = new Hand();
          for (const t of h.getTiles()) simR.push(new Tile(t.getFamily(), t.getValue(), t.isRed()));
          simR.push(new Tile(fam, val, true));
          simR.sort();
          if (simR.toGroup() !== undefined) {
            this.tenpaiCache[player] = true;
            this.tenpaiCacheVersion[player] = this.handVersion[player];
            return true;
          }
        }
      }
    }

    // winds family 4 values 1..4
    for (let val = 1; val <= 4; val++) {
      const sim = new Hand();
      for (const t of h.getTiles()) {
        sim.push(new Tile(t.getFamily(), t.getValue(), t.isRed()));
      }
        sim.push(new Tile(4, val, false));
      sim.sort();
      if (sim.toGroup() !== undefined) {
        this.tenpaiCache[player] = true;
        this.tenpaiCacheVersion[player] = this.handVersion[player];
        return true;
      }
    }

    // dragons family 5 values 1..3
    for (let val = 1; val <= 3; val++) {
      const sim = new Hand();
      for (const t of h.getTiles()) {
        sim.push(new Tile(t.getFamily(), t.getValue(), t.isRed()));
      }
      sim.push(new Tile(5, val, false));
      sim.sort();
      if (sim.toGroup() !== undefined) {
        this.tenpaiCache[player] = true;
        this.tenpaiCacheVersion[player] = this.handVersion[player];
        return true;
      }
      // try red dragon? dragons don't have red variants, skip
    }

    // update cache
    this.tenpaiCache[player] = false;
    this.tenpaiCacheVersion[player] = this.handVersion[player];
    return false;
  }

  private canDeclareRiichi(player: number): boolean {
    // Only allow declaring Riichi for player 0 in the UI; general rule: it's the player's turn,
    // they have just drawn (hasPicked true), haven't yet discarded (hasPlayed false), hand closed,
    // in tenpai, and haven't already declared.
    if (player !== 0) return false;
    if (this.turn !== player) return false;
    if (!this.hasPicked || this.hasPlayed) return false;
    if (this.groups[player] && this.groups[player].length > 0) return false; // not closed
    if (this.declaredRiichi[player]) return false;
    // When yakus are enabled, allow Riichi either when in tenpai normally
    // or when at least one winning tile would produce a yaku.
    const hand = this.hands[player];
    // If the player currently has 14 tiles (just drawn), check any possible
    // 13-tile variant (remove one tile) for tenpai rules.
    if (hand.length && hand.length() === 14) {
      const tiles = hand.getTiles();
      const removableLabels: string[] = [];
      const perRemoval: Array<any> = [];
      for (let i = 0; i < 14; i++) {
        const sim = new Hand();
        for (let j = 0; j < tiles.length; j++) {
          if (j === i) continue;
          const t = tiles[j];
          sim.push(new Tile(t.getFamily(), t.getValue(), t.isRed()));
        }
        sim.sort();
        const isTen = this.handIsTenpai(sim);
        const info: any = { removed: this.formatTile(tiles[i]), isTenpai: isTen };
        let foundWinningTiles: string[] = [];
        let yakusPerWin: Record<string, Array<{ name: string; han: number }>> = {};

        // If yakus are enabled, search winning tiles and list yakus
        if (this.enableYakus) {
          // iterate all possible tile types
          for (let fam = 1; fam <= 3; fam++) {
            for (let val = 1; val <= 9; val++) {
              const sim2 = new Hand();
              for (const t of sim.getTiles()) sim2.push(new Tile(t.getFamily(), t.getValue(), t.isRed()));
              sim2.push(new Tile(fam, val, false));
              sim2.sort();
              if (sim2.toGroup() !== undefined) {
                const simGroups = sim2.toGroup() as Array<Group> | undefined;
                const combined = this.groups[player].concat(simGroups ? simGroups : []);
                const yakuList = this.getYakusForHand(sim2, combined);
                const tileLabel = this.formatTile(new Tile(fam, val, false));
                foundWinningTiles.push(tileLabel);
                yakusPerWin[tileLabel] = yakuList;
              }
              // try red five variant
              if (val === 5) {
                const sim2r = new Hand();
                for (const t of sim.getTiles()) sim2r.push(new Tile(t.getFamily(), t.getValue(), t.isRed()));
                sim2r.push(new Tile(fam, val, true));
                sim2r.sort();
                if (sim2r.toGroup() !== undefined) {
                  const simGroups = sim2r.toGroup() as Array<Group> | undefined;
                  const combined = this.groups[player].concat(simGroups ? simGroups : []);
                  const yakuList = this.getYakusForHand(sim2r, combined);
                  const tileLabel = this.formatTile(new Tile(fam, val, true));
                  foundWinningTiles.push(tileLabel);
                  yakusPerWin[tileLabel] = yakuList;
                }
              }
            }
          }
          for (let val = 1; val <= 4; val++) {
            const sim2 = new Hand();
            for (const t of sim.getTiles()) sim2.push(new Tile(t.getFamily(), t.getValue(), t.isRed()));
            sim2.push(new Tile(4, val, false));
            sim2.sort();
            if (sim2.toGroup() !== undefined) {
              const simGroups = sim2.toGroup() as Array<Group> | undefined;
              const combined = this.groups[player].concat(simGroups ? simGroups : []);
              const yakuList = this.getYakusForHand(sim2, combined);
              const tileLabel = this.formatTile(new Tile(4, val, false));
              foundWinningTiles.push(tileLabel);
              yakusPerWin[tileLabel] = yakuList;
            }
          }
          for (let val = 1; val <= 3; val++) {
            const sim2 = new Hand();
            for (const t of sim.getTiles()) sim2.push(new Tile(t.getFamily(), t.getValue(), t.isRed()));
            sim2.push(new Tile(5, val, false));
            sim2.sort();
            if (sim2.toGroup() !== undefined) {
              const simGroups = sim2.toGroup() as Array<Group> | undefined;
              const combined = this.groups[player].concat(simGroups ? simGroups : []);
              const yakuList = this.getYakusForHand(sim2, combined);
              const tileLabel = this.formatTile(new Tile(5, val, false));
              foundWinningTiles.push(tileLabel);
              yakusPerWin[tileLabel] = yakuList;
            }
          }
        } else {
          // If yakus not enabled but sim is tenpai, we still consider it removable
          if (!isTen) {
            // no-op
          }
        }

        info.winningTiles = foundWinningTiles;
        info.yakusPerWin = yakusPerWin;
        perRemoval.push(info);
        if (!this.enableYakus && isTen) removableLabels.push(this.formatTile(tiles[i]));
        if (this.enableYakus && foundWinningTiles.length > 0) removableLabels.push(this.formatTile(tiles[i]));
      }
      if (player === 0) {
        if (removableLabels.length > 0) {
          console.debug("canDeclareRiichi (14->13) removable tiles:", removableLabels);
        } else {
          console.debug("canDeclareRiichi (14->13) no removable tile makes tenpai", { player });
        }
        // Detailed per-removal dump for debugging
        console.debug("canDeclareRiichi (14->13) details:", perRemoval);
      }
      return removableLabels.length > 0;
    }

    if (!this.enableYakus) {
      const res = this.isTenpai(player);
      if (player === 0) console.debug("canDeclareRiichi (yakus disabled) ->", { player, turn: this.turn, hasPicked: this.hasPicked, hasPlayed: this.hasPlayed, groups: this.groups[player]?.length, declaredRiichi: this.declaredRiichi[player], isTenpai: res });
      return res;
    }
    const tenpai = this.isTenpai(player);
    const tenpaiY = this.isTenpaiWithYaku(player);
    if (player === 0) console.debug("canDeclareRiichi ->", { player, turn: this.turn, hasPicked: this.hasPicked, hasPlayed: this.hasPlayed, groups: this.groups[player]?.length, declaredRiichi: this.declaredRiichi[player], isTenpai: tenpai, isTenpaiWithYaku: tenpaiY });
    return tenpai || tenpaiY;
  }

  // Helper: test tenpai for an arbitrary Hand instance (no caching)
  private handIsTenpai(h: Hand): boolean {
    // quick guard: hand should not already be winning
    if (h.toGroup() !== undefined) return false;

    // suits 1..3 values 1..9
    for (let fam = 1; fam <= 3; fam++) {
      for (let val = 1; val <= 9; val++) {
        const sim = new Hand();
        for (const t of h.getTiles()) sim.push(new Tile(t.getFamily(), t.getValue(), t.isRed()));
        sim.push(new Tile(fam, val, false));
        sim.sort();
        if (sim.toGroup() !== undefined) return true;
        if (val === 5) {
          const simR = new Hand();
          for (const t of h.getTiles()) simR.push(new Tile(t.getFamily(), t.getValue(), t.isRed()));
          simR.push(new Tile(fam, val, true));
          simR.sort();
          if (simR.toGroup() !== undefined) return true;
        }
      }
    }

    // winds family 4 values 1..4
    for (let val = 1; val <= 4; val++) {
      const sim = new Hand();
      for (const t of h.getTiles()) sim.push(new Tile(t.getFamily(), t.getValue(), t.isRed()));
      sim.push(new Tile(4, val, false));
      sim.sort();
      if (sim.toGroup() !== undefined) return true;
    }

    // dragons family 5 values 1..3
    for (let val = 1; val <= 3; val++) {
      const sim = new Hand();
      for (const t of h.getTiles()) sim.push(new Tile(t.getFamily(), t.getValue(), t.isRed()));
      sim.push(new Tile(5, val, false));
      sim.sort();
      if (sim.toGroup() !== undefined) return true;
    }

    return false;
  }

  // Helper: for an arbitrary Hand, check if any winning tile produces >=1 yaku
  private handIsTenpaiWithYaku(h: Hand, groups: Array<Group>): boolean {
    // If already winning and has yaku
    if (h.toGroup() !== undefined) {
      const simGroups = h.toGroup() as Array<Group> | undefined;
      const combined = groups.concat(simGroups ? simGroups : []);
      return this.handHasAnyYaku(h, combined);
    }

    // suits
    for (let fam = 1; fam <= 3; fam++) {
      for (let val = 1; val <= 9; val++) {
        const sim = new Hand();
        for (const t of h.getTiles()) sim.push(new Tile(t.getFamily(), t.getValue(), t.isRed()));
        sim.push(new Tile(fam, val, false));
        sim.sort();
        let simGroups = sim.toGroup() as Array<Group> | undefined;
        if (simGroups !== undefined) {
          const combined = groups.concat(simGroups);
          if (this.handHasAnyYaku(sim, combined)) return true;
        }
        // try red five
        if (val === 5) {
          const simR = new Hand();
          for (const t of h.getTiles()) simR.push(new Tile(t.getFamily(), t.getValue(), t.isRed()));
          simR.push(new Tile(fam, val, true));
          simR.sort();
          simGroups = simR.toGroup() as Array<Group> | undefined;
          if (simGroups !== undefined) {
            const combined = groups.concat(simGroups);
            if (this.handHasAnyYaku(simR, combined)) return true;
          }
        }
      }
    }

    // winds
    for (let val = 1; val <= 4; val++) {
      const sim = new Hand();
      for (const t of h.getTiles()) sim.push(new Tile(t.getFamily(), t.getValue(), t.isRed()));
      sim.push(new Tile(4, val, false));
      sim.sort();
      const simGroups = sim.toGroup() as Array<Group> | undefined;
      if (simGroups !== undefined) {
        const combined = groups.concat(simGroups);
        if (this.handHasAnyYaku(sim, combined)) return true;
      }
    }

    // dragons
    for (let val = 1; val <= 3; val++) {
      const sim = new Hand();
      for (const t of h.getTiles()) sim.push(new Tile(t.getFamily(), t.getValue(), t.isRed()));
      sim.push(new Tile(5, val, false));
      sim.sort();
      const simGroups = sim.toGroup() as Array<Group> | undefined;
      if (simGroups !== undefined) {
        const combined = groups.concat(simGroups);
        if (this.handHasAnyYaku(sim, combined)) return true;
      }
    }

    return false;
  }

  /**
   * Return true if the player's closed hand is waiting on at least one tile
   * that would produce a winning hand containing at least one yaku.
   */
  private isTenpaiWithYaku(player: number): boolean {
    const h = this.hands[player];
    // If hand already winning and has yaku, it's trivially true
    if (h.toGroup() !== undefined && this.handHasAnyYaku(h, this.groups[player])) return true;

    // Try all possible tile types
    for (let fam = 1; fam <= 3; fam++) {
      for (let val = 1; val <= 9; val++) {
        const sim = new Hand();
        for (const t of h.getTiles()) sim.push(new Tile(t.getFamily(), t.getValue(), t.isRed()));
        sim.push(new Tile(fam, val, false));
        sim.sort();
        const simGroups = sim.toGroup() as Array<Group> | undefined;
        if (simGroups !== undefined) {
          const combined = this.groups[player].concat(simGroups);
          if (this.handHasAnyYaku(sim, combined)) return true;
        }
      }
    }

    for (let val = 1; val <= 4; val++) {
      const sim = new Hand();
      for (const t of h.getTiles()) sim.push(new Tile(t.getFamily(), t.getValue(), t.isRed()));
      sim.push(new Tile(4, val, false));
      sim.sort();
      const simGroups = sim.toGroup() as Array<Group> | undefined;
      if (simGroups !== undefined) {
        const combined = this.groups[player].concat(simGroups);
        if (this.handHasAnyYaku(sim, combined)) return true;
      }
    }

    for (let val = 1; val <= 3; val++) {
      const sim = new Hand();
      for (const t of h.getTiles()) sim.push(new Tile(t.getFamily(), t.getValue(), t.isRed()));
      sim.push(new Tile(5, val, false));
      sim.sort();
      const simGroups = sim.toGroup() as Array<Group> | undefined;
      if (simGroups !== undefined) {
        const combined = this.groups[player].concat(simGroups);
        if (this.handHasAnyYaku(sim, combined)) return true;
      }
    }

    return false;
  }

  private declareRiichi(player: number): void {
    this.declaredRiichi[player] = true;
    // For now we only set the flag. In a full implementation we'd place the riichi stick,
    // lock the hand, and handle the bet. Mark static buffer dirty so UI updates next frame.
    this.staticDirty = true;
  }

  private pon(p: number, thief: number = 0): void {
    const t = this.discards[p].pop() as Tile;
    this.lastDiscard = undefined;
    
    const t2 = this.hands[thief].find(t.getFamily(), t.getValue()) as Tile;
    const t3 = this.hands[thief].find(t.getFamily(), t.getValue()) as Tile;
    
    [t, t2, t3].forEach(tile => tile.setTilt());
    
    this.groups[thief].push(new Group([t, t2, t3], p, thief));
    
    // mark thief hand changed
    this.handVersion[thief] = (this.handVersion[thief] || 0) + 1;
    this.tenpaiCacheVersion[thief] = -1;
    this.canRonCache = { result: false };

    if (this.hasWin(thief) && (!this.enableYakus || this.handHasAnyYaku(this.hands[thief], this.groups[thief]))) {
      this.resolveWin(thief, thief === 0 ? 1 : 2);
    }
    
    this.updateWaitingTime();
    this.turn = thief;
    this.hasPicked = true;
    this.hasPlayed = false;
  }

  private hasWin(p: number): boolean {
    return this.hands[p].toGroup() !== undefined;
  }

  private drawGame(): void {
		// Update game state
    this.play();
    
    // Draw game elements
    drawState(this.staticCtx, this.turn, GAME_CONSTANTS.PI / 2 * this.windPlayer);
    this.drawDiscardSize();
    this.drawResult();
    this.drawHands();
    this.drawGroups(GAME_CONSTANTS.DISPLAY.GROUP_SIZE);
    
    // Draw discards for all players
    for (let i = 0; i < GAME_CONSTANTS.PLAYERS; i++) {
      this.drawDiscard(
        i,
        this.selectedTile !== undefined ? this.hands[0].get(this.selectedTile) : undefined
      );
    }
    
    // Draw UI elements
    if (this.chooseChii) {
      drawChiis(this.staticCtx, this.getChii(0));
    } else {
      // Compute availability of ron/tsumo for player 0
      const canTsumoLocal = this.hasPicked && this.hasWin(0) && (!this.enableYakus || this.handHasAnyYaku(this.hands[0], this.groups[0]));
      let canRonLocal = false;
      if (this.lastDiscard !== undefined && this.lastDiscard !== 0) {
        // Use cache when lastDiscard and player's hand version are unchanged
        if (this.canRonCache.lastDiscard === this.lastDiscard && this.canRonCache.handVer === this.handVersion[0]) {
          canRonLocal = this.canRonCache.result;
        } else {
          const d = this.discards[this.lastDiscard];
          if (d && d.length > 0) {
            const last = d[d.length - 1];
            const sim = new Hand();
            for (const t of this.hands[0].getTiles()) {
              sim.push(new Tile(t.getFamily(), t.getValue(), t.isRed()));
            }
            sim.push(new Tile(last.getFamily(), last.getValue(), last.isRed()));
            sim.sort();
            const simGroups = sim.toGroup() as Array<Group> | undefined;
            const combinedGroups = this.groups[0].concat(simGroups ? simGroups : []);
            canRonLocal = sim.toGroup() !== undefined && (!this.enableYakus || this.handHasAnyYaku(sim, combinedGroups));
          } else {
            canRonLocal = false;
          }
          // update cache
          this.canRonCache = { lastDiscard: this.lastDiscard, handVer: this.handVersion[0], result: canRonLocal };
        }
      }

      const canRiichiLocal = this.canDeclareRiichi(0);
      drawButtons(
        this.staticCtx,
        this.canDoAChii().length > 0,
        this.canDoAPon(),
        false && this.level > 1,
        canRonLocal,
        canTsumoLocal,
        canRiichiLocal
      );
    }
  }

  private drawHands(): void {
    const showHands = false;
    const { HAND_SIZE, HIDDEN_HAND_SIZE } = GAME_CONSTANTS.DISPLAY;
    
    // Draw player's hand
    this.hands[0].drawHand(
      this.staticCtx,
      2.5 * 75 * 0.75,
      1000 - 150 * HAND_SIZE,
      5 * HAND_SIZE,
      0.75,
      this.selectedTile,
      false,
      0
    );
    
    // Draw opponents' hands
    this.hands[1].drawHand(
      this.staticCtx,
      1000 - 150 * HIDDEN_HAND_SIZE,
      1000 - 75 * 5 * HIDDEN_HAND_SIZE,
      5 * HIDDEN_HAND_SIZE,
      HIDDEN_HAND_SIZE,
      undefined,
      !showHands,
      -GAME_CONSTANTS.PI / 2
    );
    
    this.hands[2].drawHand(
      this.staticCtx,
      1000 - 75 * 5 * HIDDEN_HAND_SIZE,
      150 * HIDDEN_HAND_SIZE,
      5 * HIDDEN_HAND_SIZE,
      HIDDEN_HAND_SIZE,
      undefined,
      !showHands,
      -GAME_CONSTANTS.PI
    );
    
    this.hands[3].drawHand(
      this.staticCtx,
      150 * HIDDEN_HAND_SIZE,
      75 * 5 * HIDDEN_HAND_SIZE,
      5 * HIDDEN_HAND_SIZE,
      HIDDEN_HAND_SIZE,
      undefined,
      !showHands,
      GAME_CONSTANTS.PI / 2
    );
  }

  private drawGroups(size: number): void {
    const offset = 25;
    
    for (let p = 0; p < GAME_CONSTANTS.PLAYERS; p++) {
      const rotation = this.rotations[p];
      const groups = this.groups[p];
      
      if (groups.length > 0) {
        for (let i = groups.length - 1; i >= 0; i--) {
          groups[i].drawGroup(
            this.staticCtx,
            1050 - 240 - (260 + offset) * size * i,
            1050 - 62,
            5,
            0.6,
            rotation,
            this.selectedTile !== undefined ? this.hands[0].get(this.selectedTile) : undefined
          );
        }
      }
    }
  }

  private drawDiscard(p: number, highlightedTile: Tile | undefined): void {
    const sizeDiscard = GAME_CONSTANTS.DISPLAY.DISCARD_SIZE;
    
    this.staticCtx.save();
    this.staticCtx.translate(525, 525);
    this.staticCtx.rotate(this.rotations[p]);
    
    const x = -sizeDiscard * 475 / 2;
    const y = sizeDiscard * (475 / 2 + 5);
    
    // Draw all discarded tiles
    for (let i = 0; i < this.discards[p].length; i++) {
      const tile = this.discards[p][i];
      let tx, ty;
      
      if (i < 12) {
        tx = x + (i % 6) * 80 * sizeDiscard;
        ty = y + Math.floor(i / 6) * 105 * sizeDiscard;
      } else {
        tx = x + (i - 12) * 80 * sizeDiscard;
        ty = y + 2 * 105 * sizeDiscard;
      }
      
      tile.drawTile(
        this.staticCtx,
        tx,
        ty,
        sizeDiscard,
        false,
        0,
        highlightedTile?.isEqual(tile.getFamily(), tile.getValue())
      );
    }
    
    // Draw indicator for last discard
    if (this.lastDiscard === p) {
      this.drawLastDiscardIndicator(p);
    }
    
    this.staticCtx.restore();
  }

  private drawLastDiscardIndicator(p: number): void {
    const j = this.discards[p].length - 1;
    const sizeDiscard = GAME_CONSTANTS.DISPLAY.DISCARD_SIZE;
    const x = -sizeDiscard * 475 / 2;
    const y = sizeDiscard * (475 / 2 + 5);
    
    let tx = j < 12 
      ? x + (j % 6) * 80 * sizeDiscard 
      : x + (j - 12) * 80 * sizeDiscard;
      
    let ty = j < 12
      ? y + Math.floor(j / 6) * 105 * sizeDiscard
      : y + 2 * 105 * sizeDiscard;
    
    tx += 75 / 2 * sizeDiscard;
    ty += 115 * sizeDiscard;
    
    const triangleSize = 10;
    this.staticCtx.fillStyle = "#ff0000";
    this.staticCtx.beginPath();
    this.staticCtx.moveTo(tx, ty);
    this.staticCtx.lineTo(tx + triangleSize / 2, ty + 0.866 * triangleSize);
    this.staticCtx.lineTo(tx - triangleSize / 2, ty + 0.866 * triangleSize);
    this.staticCtx.lineTo(tx, ty);
    this.staticCtx.fill();
    this.staticCtx.stroke();
  }

  private drawDiscardSize(): void {
    this.staticCtx.fillStyle = "#f070f0";
    this.staticCtx.font = "40px garamond";
    
    const remainingTiles = this.deck.length();
    const x = remainingTiles < 10 ? 517 : 507;
    
    this.staticCtx.fillText(remainingTiles.toString(), x, 537);
  }

  private drawResult(): void {
    if (this.result === -1) return;
    
    // Draw result background
    this.staticCtx.fillStyle = "#e0e0f0";
    this.staticCtx.fillRect(450, 430, 150, 190);
    this.staticCtx.fillRect(430, 450, 190, 150);
    
    // Draw result text
    this.staticCtx.fillStyle = "#ff0000";
    this.staticCtx.font = "45px garamond";
    
    if (this.result === 0) {
      this.staticCtx.fillText("Égalité", 450, 535);
    } else if (this.result === 1) {
      this.staticCtx.fillText("Victoire !", 440, 535);
    } else if (this.result === 2) {
      this.staticCtx.fillText("Défaite...", 440, 535);
    }
  }

  public async preload(): Promise<void> {
    await this.deck.preload();
    await Promise.all(this.hands.map(h => h.preload()));
  }

  // Expose last yakus for UI/display when enabled
  public getLastYakus(): Array<{ name: string; han: number }> {
    return this.lastYakus;
  }

  public getLastTotalHan(): number {
    return this.lastTotalHan;
  }
}
