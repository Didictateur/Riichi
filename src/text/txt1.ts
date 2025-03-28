import { drawText } from "./parse"

const CANVAS_ID = "myTextCanvas";
const BG_RECT = { x: 0, y: 0, w: 800, h: 1050, color: "#007733" };

const canvas = document.getElementById(CANVAS_ID) as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as NonNullable<CanvasRenderingContext2D>;
canvas.width = BG_RECT.w;
canvas.height = BG_RECT.h;

const path = "../src/text/";

ctx.fillStyle = BG_RECT.color;
ctx.fillRect(BG_RECT.x, BG_RECT.y, BG_RECT.w, BG_RECT.h);

drawText(path + "txt1.txt", ctx).catch(error => console.error(error));

export {};
