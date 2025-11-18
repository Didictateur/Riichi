export async function drawText(
	filePath: string,
	ctx: CanvasRenderingContext2D,
): Promise<void> {
	// New implementation: word-based wrapping, DPR-aware canvas resize,
	// simple inline formatting markers: *bold*, ~italic~, #rrggbb{color}...
	const raw = await fetch(filePath).then(r => r.text());

	const DEFAULT_COLOR = "#ffffff";
	const BASE_FONT_SIZE = 30; // in CSS px
	const FONT_FAMILY = "Garamond, serif";
	const MARGIN_X = 10;
	const MARGIN_Y = 10;
	const LINE_SPACING = 1.25; // multiplier

	const canvas = ctx.canvas;
	const dpr = (window.devicePixelRatio || 1);

	// Helper to build font string for canvas context
	const fontFor = (size: number, bold: boolean, italic: boolean) => {
		return `${italic ? 'italic ' : ''}${bold ? 'bold ' : ''}${size}px ${FONT_FAMILY}`;
	};

	// Tokenize raw text into words/newlines while preserving inline styles
	type Style = { bold: boolean; italic: boolean; color?: string };
	type Token = { text: string; style: Style };

	function tokenize(input: string): Token[] {
		const tokens: Token[] = [];
		let i = 0;
		let currentStyle: Style = { bold: false, italic: false };
		while (i < input.length) {
			const ch = input[i];
			if (ch === '*') { currentStyle = { ...currentStyle, bold: !currentStyle.bold }; i++; continue; }
			if (ch === '~') { currentStyle = { ...currentStyle, italic: !currentStyle.italic }; i++; continue; }
			if (ch === '#') {
				// read hex up to '{'
				let hex = '#';
				i++;
				while (i < input.length && input[i] !== '{') { hex += input[i++]; }
				if (i < input.length && input[i] === '{') {
					// consume '{'
					i++;
					// read until closing '}' or newline
					let inner = '';
					while (i < input.length && input[i] !== '}') { inner += input[i++]; }
					// consume '}' if present
					if (i < input.length && input[i] === '}') i++;
					// push inner text as a token with color hex
					if (inner.length > 0) {
						tokens.push({ text: inner, style: { ...currentStyle, color: hex } });
					}
					continue;
				} else {
					// fallback: just treat '#' as normal char
					tokens.push({ text: '#', style: { ...currentStyle } });
					continue;
				}
			}

			if (ch === '\n') {
				tokens.push({ text: '\n', style: { ...currentStyle } });
				i++; continue;
			}

			// read a word (until whitespace or newline)
			if (ch === ' ' || ch === '\t' || ch === '\r') {
				// collapse sequences of spaces into single space token
				let spaces = '';
				while (i < input.length && (input[i] === ' ' || input[i] === '\t' || input[i] === '\r')) { spaces += input[i++]; }
				tokens.push({ text: ' ', style: { ...currentStyle } });
				continue;
			}

			// regular word
			let w = '';
			while (i < input.length && input[i] !== ' ' && input[i] !== '\n' && input[i] !== '\t' && input[i] !== '\r') {
				// handle formatting markers inside words by breaking
				if (input[i] === '*' || input[i] === '~' || input[i] === '#') break;
				w += input[i++];
			}
			if (w.length > 0) tokens.push({ text: w, style: { ...currentStyle } });
		}
		return tokens;
	}

	const tokens = tokenize(raw);

	// Use an offscreen canvas to measure text widths
	const measureCanvas = document.createElement('canvas');
	const mctx = measureCanvas.getContext('2d') as CanvasRenderingContext2D;

	// Determine max allowed width (allow text to expand but cap to viewport)
	const MAX_ALLOWED_CSS_WIDTH = Math.max(200, Math.min(window.innerWidth - 40, 1050));

	// Build lines by measuring tokens and wrapping
	const lines: Token[][] = [];
	let currentLine: Token[] = [];
	let currentLineWidth = 0;
	let measuredMaxLineWidth = 0;

	const spaceWidthCache = new Map<string, number>();

	function measureTokenWidth(tok: Token) {
		const font = fontFor(BASE_FONT_SIZE, tok.style.bold, tok.style.italic);
		mctx.font = font;
		return mctx.measureText(tok.text).width;
	}

	for (let i = 0; i < tokens.length; i++) {
		const tok = tokens[i];
		if (tok.text === '\n') {
			// push current line and start a new one
			lines.push(currentLine);
			measuredMaxLineWidth = Math.max(measuredMaxLineWidth, currentLineWidth);
			currentLine = [];
			currentLineWidth = 0;
			continue;
		}

		// measure token width
		let w = measureTokenWidth(tok);

		// treat spaces as small width
		if (tok.text === ' ') {
			currentLine.push(tok);
			currentLineWidth += w;
			continue;
		}

		// If token is wider than the allowed width, try to break it into smaller tokens (characters)
		const availableWidth = MAX_ALLOWED_CSS_WIDTH - 2 * MARGIN_X;
		if (w > availableWidth) {
			// break the token into single-character tokens (preserve style)
			for (const ch of tok.text) {
				const charTok: Token = { text: ch, style: { ...tok.style } };
				const cw = measureTokenWidth(charTok);
				if (currentLine.length > 0 && (currentLineWidth + cw) > availableWidth) {
					lines.push(currentLine);
					measuredMaxLineWidth = Math.max(measuredMaxLineWidth, currentLineWidth);
					currentLine = [charTok];
					currentLineWidth = cw;
				} else {
					currentLine.push(charTok);
					currentLineWidth += cw;
				}
			}
			continue;
		}

		// If adding this word would exceed max width, wrap
		if (currentLine.length > 0 && (currentLineWidth + w) > availableWidth) {
			lines.push(currentLine);
			measuredMaxLineWidth = Math.max(measuredMaxLineWidth, currentLineWidth);
			currentLine = [tok];
			currentLineWidth = w;
		} else {
			currentLine.push(tok);
			currentLineWidth += w;
		}
	}
	// push last line
	if (currentLine.length > 0) {
		lines.push(currentLine);
		measuredMaxLineWidth = Math.max(measuredMaxLineWidth, currentLineWidth);
	}

	const cssWidth = Math.min(MAX_ALLOWED_CSS_WIDTH, Math.ceil(measuredMaxLineWidth + 2 * MARGIN_X));
	const lineHeight = Math.ceil(BASE_FONT_SIZE * LINE_SPACING);
	const cssHeight = Math.ceil(lines.length * lineHeight + 2 * MARGIN_Y);

	// Resize canvas with DPR awareness. Re-get context after setting width/height (context is reset).
	canvas.style.width = cssWidth + 'px';
	canvas.style.height = cssHeight + 'px';
	canvas.width = Math.max(1, Math.round(cssWidth * dpr));
	canvas.height = Math.max(1, Math.round(cssHeight * dpr));

	const drawCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
	// reset transform and scale for DPR
	drawCtx.setTransform(1, 0, 0, 1, 0, 0);
	drawCtx.scale(dpr, dpr);

	// Do not clear background here — caller may have drawn background. But
	// to avoid artifacts on increased canvas size, we can clear the interior area.
	drawCtx.clearRect(0, 0, cssWidth, cssHeight);

	// Draw lines
	let y = MARGIN_Y + BASE_FONT_SIZE; // baseline for first line
	for (const lineTokens of lines) {
		let x = MARGIN_X;
		for (const tok of lineTokens) {
			if (tok.text === ' ') {
				// measure and advance
				drawCtx.font = fontFor(BASE_FONT_SIZE, tok.style.bold, tok.style.italic);
				const sw = drawCtx.measureText(' ').width;
				x += sw;
				continue;
			}
			drawCtx.font = fontFor(BASE_FONT_SIZE, tok.style.bold, tok.style.italic);
			drawCtx.fillStyle = tok.style.color || DEFAULT_COLOR;
			drawCtx.fillText(tok.text, x, y);
			const w = drawCtx.measureText(tok.text).width;
			x += w;
		}
		y += lineHeight;
	}

	// update an offscreen accessible copy for screen readers
	try {
		let htmlCopy = document.getElementById('textHtmlCopy');
		if (!htmlCopy) {
			htmlCopy = document.createElement('div');
			htmlCopy.id = 'textHtmlCopy';
			htmlCopy.style.position = 'absolute';
			htmlCopy.style.left = '-9999px';
			htmlCopy.style.top = 'auto';
			htmlCopy.style.width = '1px';
			htmlCopy.style.height = '1px';
			htmlCopy.style.overflow = 'hidden';
			document.body.appendChild(htmlCopy);
		}
		// plain text variant: strip formatting markers
		const plain = raw.replace(/\*|~/g, '').replace(/#([0-9a-fA-F]+)\{([^}]*)\}/g, '$2');
		htmlCopy.textContent = plain;
	} catch (e) {
		// non-fatal
		console.warn('Could not create accessible text copy', e);
	}
}
