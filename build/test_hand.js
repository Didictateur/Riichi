/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/group.ts":
/*!**********************!*\
  !*** ./src/group.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Group: () => (/* binding */ Group)\n/* harmony export */ });\nclass Group {\n    constructor(tiles, stolenFrom, belongsTo) {\n        this.tiles = tiles;\n        this.stolenFrom = stolenFrom;\n        this.belongsTo = belongsTo;\n    }\n    push(tile) {\n        this.tiles.push(tile);\n    }\n    pop() {\n        return this.tiles.pop();\n    }\n    getTiles() {\n        return this.tiles;\n    }\n    compare(g) {\n        // Compare les premiers tiles, puis les seconds si égalité\n        const firstComparison = this.tiles[0].compare(g.tiles[0]);\n        return firstComparison !== 0 ? firstComparison : this.tiles[1].compare(g.tiles[1]);\n    }\n    drawGroup(ctx, x, y, os, size, rotation, selectedTile) {\n        // Sauvegarde et rotation du contexte\n        ctx.save();\n        ctx.translate(525, 525);\n        ctx.rotate(rotation);\n        ctx.translate(-525, -525);\n        // Calcul des paramètres de dessin\n        const v = 75 * size;\n        const w = 90 * size;\n        const osy = 25 * size / 2;\n        const p = (this.belongsTo - this.stolenFrom - 1 + 4) % 4;\n        // Détermination du tile sélectionné\n        const sf = selectedTile === undefined ? -1 : selectedTile.getFamily();\n        const sv = selectedTile === undefined ? 0 : selectedTile.getValue();\n        // Fonction helper pour éviter la répétition de code\n        const drawTile = (tile, tx, ty, angle) => {\n            tile.drawTile(ctx, tx, ty, size, false, angle, tile.isEqual(sf, sv));\n        };\n        const HALF_PI = Math.PI / 2;\n        // Dessin selon la position\n        switch (p) {\n            case 0:\n                drawTile(this.tiles[0], x, y + osy, HALF_PI);\n                drawTile(this.tiles[1], x + w, y, 0);\n                drawTile(this.tiles[2], x + w + v + os * size, y, 0);\n                break;\n            case 1:\n                drawTile(this.tiles[0], x, y, 0);\n                drawTile(this.tiles[1], x + w, y + osy, -HALF_PI);\n                drawTile(this.tiles[2], x + w + v + 3 * os * size, y, 0);\n                break;\n            case 2:\n                drawTile(this.tiles[0], x, y, 0);\n                drawTile(this.tiles[1], x + v + os * size, y, 0);\n                drawTile(this.tiles[2], x + w + v + os * size, y + osy, -HALF_PI);\n                break;\n            default:\n                console.error(`Position non prise en charge: ${p}`);\n        }\n        ctx.restore();\n    }\n}\n\n\n//# sourceURL=webpack:///./src/group.ts?");

/***/ }),

/***/ "./src/hand.ts":
/*!*********************!*\
  !*** ./src/hand.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Hand: () => (/* binding */ Hand)\n/* harmony export */ });\n/* harmony import */ var _tile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tile */ \"./src/tile.ts\");\n/* harmony import */ var _group__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./group */ \"./src/group.ts\");\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\n\n\n// Constants to avoid magic numbers and improve readability\nconst TILE_TYPES = {\n    MANZU: { code: \"m\", family: 1 },\n    PINZU: { code: \"p\", family: 2 },\n    SOUZU: { code: \"s\", family: 3 },\n    WINDS: { code: \"w\", family: 4 },\n    DRAGONS: { code: \"d\", family: 5 }\n};\nclass Hand {\n    /**\n     * Create a hand from string representation\n     * @param stiles String representation of tiles (e.g., \"m1p2s3w1d1\")\n     */\n    constructor(stiles = \"\") {\n        this.isolate = false;\n        this.tiles = [];\n        this.initializeFromString(stiles);\n    }\n    /**\n     * Parse string representation into tiles\n     */\n    initializeFromString(stiles) {\n        for (let i = 0; i < stiles.length - 1; i++) {\n            const tileCode = stiles.substring(i, i + 2);\n            const type = tileCode[0];\n            const value = Number(tileCode[1]);\n            if (this.isValidTileCode(type, value)) {\n                this.addTileFromCode(type, value);\n            }\n        }\n    }\n    /**\n     * Check if tile code is valid\n     */\n    isValidTileCode(type, value) {\n        return ((type === TILE_TYPES.MANZU.code) ||\n            (type === TILE_TYPES.PINZU.code) ||\n            (type === TILE_TYPES.SOUZU.code) ||\n            (type === TILE_TYPES.WINDS.code) ||\n            (type === TILE_TYPES.DRAGONS.code));\n    }\n    /**\n     * Create a tile from type code and value\n     */\n    addTileFromCode(type, value) {\n        const familyMap = {\n            [TILE_TYPES.MANZU.code]: TILE_TYPES.MANZU.family,\n            [TILE_TYPES.PINZU.code]: TILE_TYPES.PINZU.family,\n            [TILE_TYPES.SOUZU.code]: TILE_TYPES.SOUZU.family,\n            [TILE_TYPES.WINDS.code]: TILE_TYPES.WINDS.family,\n            [TILE_TYPES.DRAGONS.code]: TILE_TYPES.DRAGONS.family\n        };\n        const family = familyMap[type];\n        if (family !== undefined) {\n            this.tiles.push(new _tile__WEBPACK_IMPORTED_MODULE_0__.Tile(family, value, false));\n        }\n    }\n    /**\n     * Get all tiles in hand\n     */\n    getTiles() {\n        return this.tiles;\n    }\n    /**\n     * Get number of tiles in hand\n     */\n    length() {\n        return this.tiles.length;\n    }\n    /**\n     * Add a tile to hand\n     */\n    push(tile) {\n        this.tiles.push(tile);\n    }\n    /**\n     * Remove and return the last tile\n     */\n    pop() {\n        return this.tiles.pop();\n    }\n    /**\n     * Find and remove a specific tile by family and value\n     */\n    find(family, value) {\n        const index = this.findTileIndex(family, value);\n        if (index !== -1) {\n            // Swap with first tile and remove\n            [this.tiles[index], this.tiles[0]] = [this.tiles[0], this.tiles[index]];\n            const tile = this.tiles.shift();\n            this.sort();\n            return tile;\n        }\n        return undefined;\n    }\n    /**\n     * Find index of tile with specific family and value\n     */\n    findTileIndex(family, value) {\n        return this.tiles.findIndex(tile => tile.getFamily() === family && tile.getValue() === value);\n    }\n    /**\n     * Remove tile at specific index\n     */\n    eject(idTile) {\n        if (idTile < 0 || idTile >= this.tiles.length) {\n            throw new Error(\"Invalid tile index\");\n        }\n        // Swap with first tile and remove\n        [this.tiles[0], this.tiles[idTile]] = [this.tiles[idTile], this.tiles[0]];\n        const tile = this.tiles.shift();\n        this.sort();\n        return tile;\n    }\n    /**\n     * Get tile at specific index without removing\n     */\n    get(idTile) {\n        if (idTile === undefined || idTile < 0 || idTile >= this.tiles.length) {\n            return undefined;\n        }\n        return this.tiles[idTile];\n    }\n    /**\n     * Sort tiles in ascending order\n     */\n    sort() {\n        this.tiles.sort((a, b) => a.isLessThan(b) ? -1 : 1);\n    }\n    /**\n     * Count tiles with specific family and value\n     */\n    count(family, value) {\n        return this.tiles.filter(tile => tile.getFamily() === family && tile.getValue() === value).length;\n    }\n    /**\n     * Try to form hand into groups (for winning detection)\n     */\n    toGroup(pair = false) {\n        if (this.tiles.length === 0) {\n            return [];\n        }\n        // Take last tile to try forming a group\n        const lastTile = this.tiles.pop();\n        const family = lastTile.getFamily();\n        const value = lastTile.getValue();\n        // Try to form a pair\n        if (this.count(family, value) >= 1 && !pair) {\n            const result = this.tryFormPair(lastTile);\n            if (result)\n                return result;\n        }\n        // Try to form a triplet (pon)\n        if (this.count(family, value) >= 2) {\n            const result = this.tryFormTriplet(lastTile, pair);\n            if (result)\n                return result;\n        }\n        // Try to form a sequence (chii)\n        const hasMinusOne = this.count(family, value - 1) > 0;\n        const hasMinusTwo = this.count(family, value - 2) > 0;\n        if (hasMinusOne && hasMinusTwo) {\n            const result = this.tryFormSequence(lastTile, pair);\n            if (result)\n                return result;\n        }\n        // If no valid group could be formed, put tile back and return undefined\n        this.tiles.push(lastTile);\n        this.sort();\n        return undefined;\n    }\n    /**\n     * Try to form a pair with the given tile\n     */\n    tryFormPair(tile) {\n        const pairTile = this.find(tile.getFamily(), tile.getValue());\n        const groups = this.toGroup(true);\n        // Put the tile back\n        this.tiles.push(pairTile);\n        this.sort();\n        if (groups !== undefined) {\n            this.tiles.push(tile);\n            this.sort();\n            groups.push(new _group__WEBPACK_IMPORTED_MODULE_1__.Group([tile, pairTile], 0, 0));\n            return groups;\n        }\n        return undefined;\n    }\n    /**\n     * Try to form a triplet (pon) with the given tile\n     */\n    tryFormTriplet(tile, pair) {\n        const secondTile = this.find(tile.getFamily(), tile.getValue());\n        const thirdTile = this.find(tile.getFamily(), tile.getValue());\n        const groups = this.toGroup(pair);\n        // Put tiles back\n        this.tiles.push(secondTile);\n        this.tiles.push(thirdTile);\n        this.sort();\n        if (groups !== undefined) {\n            groups.push(new _group__WEBPACK_IMPORTED_MODULE_1__.Group([tile, secondTile, thirdTile], 0, 0));\n            this.tiles.push(tile);\n            this.sort();\n            return groups;\n        }\n        return undefined;\n    }\n    /**\n     * Try to form a sequence (chii) with the given tile\n     */\n    tryFormSequence(tile, pair) {\n        const secondTile = this.find(tile.getFamily(), tile.getValue() - 1);\n        const thirdTile = this.find(tile.getFamily(), tile.getValue() - 2);\n        const groups = this.toGroup(pair);\n        // Put tiles back\n        this.tiles.push(secondTile);\n        this.tiles.push(thirdTile);\n        this.sort();\n        if (groups !== undefined) {\n            groups.push(new _group__WEBPACK_IMPORTED_MODULE_1__.Group([thirdTile, secondTile, tile], 0, 0));\n            this.tiles.push(tile);\n            this.sort();\n            return groups;\n        }\n        return undefined;\n    }\n    /**\n     * Draw hand tiles on canvas\n     */\n    drawHand(ctx, x, y, offset, size, focusedTile = undefined, hidden = false, rotation = 0) {\n        const tileOffset = (75 + offset) * size;\n        const offsetX = Math.cos(rotation) * tileOffset;\n        const offsetY = Math.sin(rotation) * tileOffset;\n        for (let i = 0; i < this.tiles.length; i++) {\n            const isLastAndIsolated = (i === this.tiles.length - 1 && this.isolate) ? 10 : 0;\n            // Calculate position\n            let tileX = x + i * offsetX + isLastAndIsolated * size * Math.cos(rotation);\n            let tileY = y + i * offsetY + isLastAndIsolated * size * Math.sin(rotation);\n            // Add additional offset for focused tile\n            if (i === focusedTile) {\n                tileX += 25 * size * Math.sin(rotation);\n                tileY -= 25 * size * Math.cos(rotation);\n            }\n            // Draw tile\n            this.tiles[i].drawTile(ctx, tileX, tileY, size, hidden, rotation);\n        }\n    }\n    /**\n     * Preload tile images\n     */\n    preload() {\n        return __awaiter(this, void 0, void 0, function* () {\n            yield Promise.all(this.tiles.map(tile => tile.preloadImg()));\n        });\n    }\n    /**\n     * Clean up resources\n     */\n    cleanup() {\n        this.tiles.forEach(tile => tile.cleanup());\n        this.tiles = [];\n    }\n}\n\n\n//# sourceURL=webpack:///./src/hand.ts?");

/***/ }),

/***/ "./src/tests/assert.ts":
/*!*****************************!*\
  !*** ./src/tests/assert.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   assert: () => (/* binding */ assert)\n/* harmony export */ });\nfunction assert(b, msg) {\n    if (b) {\n        console.log(\"%c[SUCCES] \" + msg, \"color: green\");\n        return 1;\n    }\n    else {\n        console.log(\"%c[ECHEC] \" + msg, \"color: red\");\n        return 0;\n    }\n}\n\n\n//# sourceURL=webpack:///./src/tests/assert.ts?");

/***/ }),

/***/ "./src/tests/test_hand.ts":
/*!********************************!*\
  !*** ./src/tests/test_hand.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _hand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../hand */ \"./src/hand.ts\");\n/* harmony import */ var _assert__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assert */ \"./src/tests/assert.ts\");\nvar _a, _b, _c, _d, _e;\n\n\nlet h0 = new _hand__WEBPACK_IMPORTED_MODULE_0__.Hand(\"s1s1\");\nlet h1 = new _hand__WEBPACK_IMPORTED_MODULE_0__.Hand(\"m1m2m3\");\nlet h2 = new _hand__WEBPACK_IMPORTED_MODULE_0__.Hand(\"m2m2m2 p1p1\");\nlet h3 = new _hand__WEBPACK_IMPORTED_MODULE_0__.Hand(\"m1m2m3 p1p2p3 s1s2s3 m9m9m9 p9p9\");\nlet h4 = new _hand__WEBPACK_IMPORTED_MODULE_0__.Hand(\"m2m2m2 p1p1p1\");\nlet count = 0;\nlet total = 0;\ncount += (0,_assert__WEBPACK_IMPORTED_MODULE_1__.assert)(((_a = h0.toGroup()) === null || _a === void 0 ? void 0 : _a.length) === 1, \"s11 has 1 group\");\ncount += (0,_assert__WEBPACK_IMPORTED_MODULE_1__.assert)(((_b = h1.toGroup()) === null || _b === void 0 ? void 0 : _b.length) === 1, \"m123 has 1 group\");\ncount += (0,_assert__WEBPACK_IMPORTED_MODULE_1__.assert)(((_c = h2.toGroup()) === null || _c === void 0 ? void 0 : _c.length) === 2, \"m222 p11 has 2 groups\");\ncount == (0,_assert__WEBPACK_IMPORTED_MODULE_1__.assert)(((_d = h3.toGroup()) === null || _d === void 0 ? void 0 : _d.length) === 5, \"m123 p123 s123 m999 p99 has 5 groups\");\ncount += (0,_assert__WEBPACK_IMPORTED_MODULE_1__.assert)(((_e = h4.toGroup()) === null || _e === void 0 ? void 0 : _e.length) === 2, \"m222 p111 has 2 groups\");\ntotal += 4;\nconsole.log(\"Succès: \" + count.toString() + \"/\" + total.toString());\n\n\n//# sourceURL=webpack:///./src/tests/test_hand.ts?");

/***/ }),

/***/ "./src/tile.ts":
/*!*********************!*\
  !*** ./src/tile.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Tile: () => (/* binding */ Tile)\n/* harmony export */ });\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nclass Tile {\n    constructor(family, value, red) {\n        this.family = family;\n        this.value = value;\n        this.red = red;\n        this.imgFront = new Image();\n        this.imgBack = new Image();\n        this.imgGray = new Image();\n        this.img = new Image();\n        this.imgSrc = \"\";\n        this.tilt = 0;\n        this.setImgSrc();\n    }\n    getFamily() {\n        return this.family;\n    }\n    getValue() {\n        return this.value;\n    }\n    isEqual(family, value) {\n        return this.family === family && this.value === value;\n    }\n    isRed() {\n        return this.red;\n    }\n    compare(t) {\n        // Compare d'abord par famille, puis par valeur\n        if (this.family !== t.family) {\n            return this.family < t.family ? -1 : 1;\n        }\n        if (this.value !== t.value) {\n            return this.value < t.value ? -1 : 1;\n        }\n        return 0;\n    }\n    isLessThan(t) {\n        return this.family < t.family ||\n            (this.family === t.family && this.value <= t.value);\n    }\n    setTilt() {\n        this.tilt = (1 - 2 * Math.random()) * 0.04;\n    }\n    drawTile(ctx, x, y, size, hidden = false, rotation = 0, gray = false, tilted = true) {\n        const tileWidth = 75 * size;\n        const tileHeight = 100 * size;\n        const halfWidth = tileWidth / 2;\n        const halfHeight = tileHeight / 2;\n        const shadowScale = 0.92;\n        // Sauvegarde du contexte et positionnement\n        ctx.save();\n        ctx.translate(x + halfWidth, y + halfHeight);\n        ctx.rotate(rotation + (tilted ? this.tilt : 0));\n        // Position de l'ombre (légèrement décalée)\n        const shadowX = -(tileWidth * shadowScale) / 2;\n        const shadowY = -(tileHeight * shadowScale) / 2;\n        // Dessin de l'ombre (commun aux deux cas)\n        ctx.drawImage(this.imgGray, shadowX, shadowY, tileWidth, tileHeight);\n        if (hidden) {\n            // Dessin du dos de la tuile\n            ctx.drawImage(this.imgBack, -halfWidth, -halfHeight, tileWidth, tileHeight);\n        }\n        else {\n            // Dessin de la tuile face visible\n            ctx.drawImage(this.imgFront, -halfWidth, -halfHeight, tileWidth, tileHeight);\n            // Dessin du motif sur la tuile (légèrement plus petit)\n            const patternScale = 0.9;\n            const patternWidth = tileWidth * patternScale;\n            const patternHeight = tileHeight * patternScale;\n            const patternX = -((75 - 7) * size) / 2;\n            const patternY = -((100 - 10) * size) / 2;\n            ctx.drawImage(this.img, patternX, patternY, patternWidth, patternHeight);\n            // Appliquer un filtre gris si demandé\n            if (gray) {\n                ctx.drawImage(this.imgGray, -halfWidth, -halfHeight, tileWidth, tileHeight);\n            }\n        }\n        ctx.restore();\n    }\n    cleanup() {\n        // Supprimer tous les gestionnaires d'événements\n        const images = [this.imgFront, this.imgBack, this.imgGray, this.img];\n        images.forEach(img => {\n            img.onload = null;\n            img.onerror = null;\n        });\n    }\n    preloadImg() {\n        return __awaiter(this, void 0, void 0, function* () {\n            const imagesToLoad = [\n                { img: this.imgFront, src: \"img/Regular/Front.svg\" },\n                { img: this.imgBack, src: \"img/Regular/Back.svg\" },\n                { img: this.imgGray, src: \"img/Regular/Gray.svg\" },\n                { img: this.img, src: this.imgSrc }\n            ];\n            yield Promise.all(imagesToLoad.map(({ img, src }) => this.loadImg(img, src)));\n        });\n    }\n    loadImg(img, src) {\n        return new Promise((resolve, reject) => {\n            img.onload = () => resolve();\n            img.onerror = () => reject();\n            img.src = src;\n        });\n    }\n    setImgSrc() {\n        this.imgSrc = \"img/Regular/\";\n        if (this.family <= 3) {\n            const families = [\"\", \"Man\", \"Pin\", \"Sou\"];\n            this.imgSrc += families[this.family] + String(this.value);\n            if (this.red) {\n                this.imgSrc += \"-Dora\";\n            }\n        }\n        else if (this.family === 4) {\n            const winds = [\"\", \"Ton\", \"Nan\", \"Shaa\", \"Pei\"];\n            this.imgSrc += winds[this.value];\n        }\n        else if (this.family === 5) {\n            const dragons = [\"\", \"Chun\", \"Hatsu\", \"Haku\"];\n            this.imgSrc += dragons[this.value];\n        }\n        this.imgSrc += \".svg\";\n    }\n}\n\n\n//# sourceURL=webpack:///./src/tile.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/tests/test_hand.ts");
/******/ 	
/******/ })()
;