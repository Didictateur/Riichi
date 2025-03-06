import { Tile } from "../tile"

const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;

if (canvas) {
  const ctx = canvas.getContext("2d");
  
  if (ctx) {
    ctx.fillStyle = "#007730";

    ctx.fillRect(50, 50, 1000, 1000);

		const tile = new Tile(4, 4, false);
		tile.drawTile(ctx, 100, 100, 0.5);
  } else {
    console.error("Impossible d'obtenir le contexte du canvas.");
  }
} else {
  console.error("Canvas introuvable dans le DOM.");
}

