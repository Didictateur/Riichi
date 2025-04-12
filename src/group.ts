import { Tile } from "./tile";

export class Group {
  constructor(
    private tiles: Array<Tile>,
    private stolenFrom: number,
    private belongsTo: number
  ) {}

  public push(tile: Tile): void {
    this.tiles.push(tile);
  }

  public pop(): Tile | undefined {
    return this.tiles.pop();
  }

  public getTiles(): Array<Tile> {
    return this.tiles;
  }

  public compare(g: Group): number {
    // Compare les premiers tiles, puis les seconds si égalité
    const firstComparison = this.tiles[0].compare(g.tiles[0]);
    return firstComparison !== 0 ? firstComparison : this.tiles[1].compare(g.tiles[1]);
  }

  public drawGroup(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    os: number,
    size: number,
    rotation: number,
    selectedTile?: Tile
  ): void {
    // Sauvegarde et rotation du contexte
    ctx.save();
    ctx.translate(525, 525);
    ctx.rotate(rotation);
    ctx.translate(-525, -525);

    // Calcul des paramètres de dessin
    const v = 75 * size;
    const w = 90 * size;
    const osy = 25 * size / 2;
    const p = (this.belongsTo - this.stolenFrom - 1 + 4) % 4;
    
    // Détermination du tile sélectionné
    const sf = selectedTile === undefined ? -1 : selectedTile.getFamily();
    const sv = selectedTile === undefined ? 0 : selectedTile.getValue();
    
    // Fonction helper pour éviter la répétition de code
    const drawTile = (tile: Tile, tx: number, ty: number, angle: number) => {
      tile.drawTile(
        ctx,
        tx,
        ty,
        size,
        false,
        angle,
        tile.isEqual(sf, sv)
      );
    };
    
    const HALF_PI = Math.PI / 2;

    // Dessin selon la position
    switch (p) {
      case 0:
        drawTile(this.tiles[0], x, y + osy, HALF_PI);
        drawTile(this.tiles[1], x + w, y, 0);
        drawTile(this.tiles[2], x + w + v + os * size, y, 0);
        break;
      case 1:
        drawTile(this.tiles[0], x, y, 0);
        drawTile(this.tiles[1], x + w, y + osy, -HALF_PI);
        drawTile(this.tiles[2], x + w + v + 3 * os * size, y, 0);
        break;
      case 2:
        drawTile(this.tiles[0], x, y, 0);
        drawTile(this.tiles[1], x + v + os * size, y, 0);
        drawTile(this.tiles[2], x + w + v + os * size, y + osy, -HALF_PI);
        break;
      default:
        console.error(`Position non prise en charge: ${p}`);
    }
    
    ctx.restore();
  }
}
