import { Tile } from "./tile";

/**
 * Type definition for button rendering functions
 */
type ButtonRenderer = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
) => void;

/**
 * Button configuration interface
 */
interface ButtonConfig {
  text: string;
  color: string;
  action: number;
}

// Button constants
const BUTTON_RADIUS = 8;
const BUTTON_WIDTH = 110;
const BUTTON_HEIGHT = 50;
const BUTTON_SPACING = 120;
const BUTTON_AREA_Y_MIN = 838;
const BUTTON_AREA_Y_MAX = 888;
const BUTTON_MARGIN = 10;
const BASE_X_POSITION = 850;

// Button style configurations
const BUTTON_STYLES: Record<string, ButtonConfig> = {
  pass: { text: "Ignorer", color: "#FF9030", action: 0 },
  chii: { text: "Chii", color: "#FFCC33", action: 1 },
  pon: { text: "Pon", color: "#FFCC33", action: 2 },
  kan: { text: "Kan", color: "#FFCC33", action: 3 },
  ron: { text: "Ron", color: "#FF3060", action: 4 },
  tsumo: { text: "Tsumo", color: "#FF3060", action: 5 },
  back: { text: "Retour", color: "#FF9030", action: 0 }
};

/**
 * Determines which button was clicked based on coordinates
 * @returns The action value of the clicked button or -1 if no button was clicked
 */
export function clickAction(
  x: number,
  y: number,
  chii: boolean,
  pon: boolean,
  kan: boolean,
  ron: boolean,
  tsumo: boolean
): number {
  const activeButtons = getActiveButtons(chii, pon, kan, ron, tsumo);
  
  if (activeButtons.length === 0) {
    return -1;
  }

  // Calculate starting X position based on number of buttons
  const xmin = 960 - activeButtons.length * BUTTON_SPACING;
  
  // Check if Y coordinate is within button area
  const isYInButtonArea = BUTTON_AREA_Y_MIN < y && y < BUTTON_AREA_Y_MAX;
  if (!isYInButtonArea) {
    return -1;
  }
  
  // Calculate which button was clicked
  const buttonIndex = Math.floor((x - xmin) / BUTTON_SPACING);
  const xOffset = (x - xmin) - BUTTON_SPACING * buttonIndex;
  
  if (
    buttonIndex >= 0 &&
    buttonIndex < activeButtons.length &&
    xOffset > BUTTON_MARGIN
  ) {
    return activeButtons[buttonIndex];
  }
  
  return -1;
}

/**
 * Draw all active buttons on the canvas
 */
export function drawButtons(
  ctx: CanvasRenderingContext2D,
  chii: boolean,
  pon: boolean,
  kan: boolean,
  ron: boolean,
  tsumo: boolean
): void {
  const buttonFunctions: [boolean, ButtonRenderer][] = [
    [chii, (ctx, x, y) => renderButton(ctx, x, y, BUTTON_STYLES.chii)],
    [pon, (ctx, x, y) => renderButton(ctx, x, y, BUTTON_STYLES.pon)],
    [kan, (ctx, x, y) => renderButton(ctx, x, y, BUTTON_STYLES.kan)],
    [ron, (ctx, x, y) => renderButton(ctx, x, y, BUTTON_STYLES.ron)],
    [tsumo, (ctx, x, y) => renderButton(ctx, x, y, BUTTON_STYLES.tsumo)]
  ];
  
  // Only show the pass button if at least one other button is active
  const hasActiveButtons = buttonFunctions.some(([isActive]) => isActive);
  
  if (hasActiveButtons) {
    buttonFunctions.unshift([true, (ctx, x, y) => renderButton(ctx, x, y, BUTTON_STYLES.pass)]);
  } else {
    return; // No buttons to draw
  }
  
  // Draw active buttons
  let positionOffset = 0;
  for (const [isActive, renderFunc] of buttonFunctions) {
    if (isActive) {
      renderFunc(
        ctx,
        BASE_X_POSITION - positionOffset * BUTTON_SPACING,
        835
      );
      positionOffset++;
    }
  }
}

/**
 * Determines which Chi option was clicked
 * @returns The value of the clicked Chi option or -1 if no option was clicked
 */
export function clickChii(
  x: number,
  y: number,
  chiis: Array<Array<Tile>>
): number {
  if (chiis.length === 0) {
    return -1;
  }
  
  // Calculate starting X position based on number of options
  const xmin = 960 - (chiis.length + 1) * BUTTON_SPACING;
  
  // Check if Y coordinate is within button area
  const isYInButtonArea = BUTTON_AREA_Y_MIN < y && y < BUTTON_AREA_Y_MAX;
  if (!isYInButtonArea) {
    return -1;
  }
  
  // Calculate which option was clicked
  const optionIndex = Math.floor((x - xmin) / BUTTON_SPACING);
  const xOffset = (x - xmin) - BUTTON_SPACING * optionIndex;
  
  if (
    optionIndex >= 0 &&
    optionIndex < (chiis.length + 1) &&
    xOffset > BUTTON_MARGIN
  ) {
    // Return 0 for "back" button or the value of the selected Chi option
    return optionIndex === chiis.length ? 0 : chiis[optionIndex][0].getValue();
  }
  
  return -1;
}

/**
 * Draw Chi options on the canvas
 */
export function drawChiis(
  ctx: CanvasRenderingContext2D,
  chiis: Array<Array<Tile>>
): void {
  // Create a copy to avoid modifying the original array
  const chiiOptions = [...chiis].reverse();
  
  // Draw "back" button
  renderButton(ctx, BASE_X_POSITION, 835, BUTTON_STYLES.back);
  
  // Draw Chi options
  let positionOffset = 1;
  for (const tiles of chiiOptions) {
    drawOneChii(
      ctx,
      BASE_X_POSITION - positionOffset * BUTTON_SPACING,
      835,
      tiles
    );
    positionOffset++;
  }
}

/**
 * Draw a single Chi option
 */
function drawOneChii(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  tiles: Array<Tile>
): void {
  const tileOffset = 32;
  const tileStartX = x + 7;
  const tileStartY = y + 5;
  
  // Draw the button background
  drawButtonShape(ctx, x, y, BUTTON_RADIUS, BUTTON_WIDTH, BUTTON_HEIGHT, BUTTON_STYLES.chii.color);
  
  // Draw the tiles
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].drawTile(
      ctx,
      tileStartX + tileOffset * i,
      tileStartY,
      0.4,
      false,
      0,
      false,
      false
    );
  }
}

/**
 * Get the list of active button action values
 */
function getActiveButtons(
  chii: boolean,
  pon: boolean,
  kan: boolean,
  ron: boolean,
  tsumo: boolean
): number[] {
  const buttonConfigs: [boolean, number][] = [
    [tsumo, BUTTON_STYLES.tsumo.action],
    [ron, BUTTON_STYLES.ron.action],
    [kan, BUTTON_STYLES.kan.action],
    [pon, BUTTON_STYLES.pon.action],
    [chii, BUTTON_STYLES.chii.action]
  ];
  
  const activeButtons = buttonConfigs
    .filter(([isActive]) => isActive)
    .map(([, action]) => action);
  
  // Add pass button if any other buttons are active
  if (activeButtons.length > 0) {
    activeButtons.push(BUTTON_STYLES.pass.action);
  }
  
  return activeButtons;
}

/**
 * Render a button with text
 */
function renderButton(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  config: ButtonConfig
): void {
  drawButtonShape(ctx, x, y, BUTTON_RADIUS, BUTTON_WIDTH, BUTTON_HEIGHT, config.color);
  
  // Add text to the button
  ctx.fillStyle = "black";
  ctx.font = "30px garamond";
  
  // Center text based on its length
  const textXPosition = x + BUTTON_WIDTH * (0.25 - config.text.length * 0.025);
  const textYPosition = y + BUTTON_HEIGHT/2 * 1.3;
  
  ctx.fillText(config.text, textXPosition, textYPosition);
}

/**
 * Draw a rounded rectangle button shape
 */
function drawButtonShape(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  width: number,
  height: number,
  color: string
): void {
  ctx.fillStyle = color;
  ctx.beginPath();

  // Top right corner
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  
  // Bottom right corner
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  
  // Bottom left corner
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  
  // Top left corner
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);

  ctx.fill();

  // Add border
  ctx.fillStyle = "#606060";
  ctx.stroke();
}
