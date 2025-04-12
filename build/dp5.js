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

/***/ "./src/display/dp5.ts":
/*!****************************!*\
  !*** ./src/display/dp5.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   cleanup: () => (/* binding */ cleanup),\n/* harmony export */   initDisplay: () => (/* binding */ initDisplay)\n/* harmony export */ });\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\n// Configuration globale\nconst CANVAS_ID = \"myCanvas\";\nconst BG_RECT = { x: 0, y: 0, w: 1050, h: 1050 };\nvar MOUSE = { x: 0, y: 0 };\nconst FPS = 30;\nconst FRAME_INTERVAL = 1000 / FPS;\n// variables globales\nconst DECKS = [];\nconst HANDS = [];\nvar GAME;\n// Optimisation des références\nlet animationFrameId;\nlet lastFrameTime = 0;\nconst callbacks = [];\n// Pré-calcul des dimensions\nconst canvas = document.getElementById(CANVAS_ID);\nconst ctx = canvas.getContext(\"2d\");\ncanvas.width = BG_RECT.w;\ncanvas.height = BG_RECT.h;\n// Cache statique\nconst staticCanvas = document.createElement('canvas');\nconst staticCtx = staticCanvas.getContext(\"2d\");\nstaticCanvas.width = canvas.width;\nstaticCanvas.height = canvas.height;\nfunction drawFrame() {\n    if (!ctx)\n        return;\n    GAME === null || GAME === void 0 ? void 0 : GAME.draw(MOUSE);\n}\nfunction animationLoop(currentTime) {\n    animationFrameId = requestAnimationFrame(animationLoop);\n    const deltaTime = currentTime - lastFrameTime;\n    if (deltaTime < FRAME_INTERVAL)\n        return;\n    lastFrameTime = currentTime - (deltaTime % FRAME_INTERVAL);\n    drawFrame();\n}\nfunction initEventListeners() {\n    const handlers = {\n        mousedown: (e) => {\n            GAME === null || GAME === void 0 ? void 0 : GAME.click(e);\n        },\n        mousemove: (e) => {\n            MOUSE.x = e.x;\n            MOUSE.y = e.y;\n        }\n    };\n    callbacks.push(() => {\n        canvas.removeEventListener('mousemove', handlers.mousemove);\n    });\n    canvas.addEventListener('mousedown', handlers.mousedown);\n}\nfunction preloadDeck(deck) {\n    return __awaiter(this, void 0, void 0, function* () {\n        yield deck.preload();\n    });\n}\nfunction preloadHand(hand) {\n    return __awaiter(this, void 0, void 0, function* () {\n        yield hand.preload();\n    });\n}\nfunction cleanup() {\n    cancelAnimationFrame(animationFrameId);\n    callbacks.forEach(fn => fn());\n}\nfunction initDisplay() {\n    return __awaiter(this, void 0, void 0, function* () {\n        if (!ctx) {\n            console.error(\"Context canvas indisponible\");\n            return;\n        }\n        console.log(\"Load begining\\n\");\n        // Préchargement des ressources si nécessaire\n        // const deck = new Deck();\n        // await preloadDeck(deck);\n    });\n}\n// Initialisation automatique si le script est chargé directement\nif (typeof window !== 'undefined') {\n    initDisplay().catch(console.error);\n}\n\n\n//# sourceURL=webpack:///./src/display/dp5.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
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
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/display/dp5.ts"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;