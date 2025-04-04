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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   cleanup: () => (/* binding */ cleanup),\n/* harmony export */   initDisplay: () => (/* binding */ initDisplay)\n/* harmony export */ });\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __generator = (undefined && undefined.__generator) || function (thisArg, body) {\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === \"function\" ? Iterator : Object).prototype);\n    return g.next = verb(0), g[\"throw\"] = verb(1), g[\"return\"] = verb(2), typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\n    function verb(n) { return function (v) { return step([n, v]); }; }\n    function step(op) {\n        if (f) throw new TypeError(\"Generator is already executing.\");\n        while (g && (g = 0, op[0] && (_ = 0)), _) try {\n            if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\n            if (y = 0, t) op = [op[0] & 2, t.value];\n            switch (op[0]) {\n                case 0: case 1: t = op; break;\n                case 4: _.label++; return { value: op[1], done: false };\n                case 5: _.label++; y = op[1]; op = [0]; continue;\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\n                default:\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\n                    if (t[2]) _.ops.pop();\n                    _.trys.pop(); continue;\n            }\n            op = body.call(thisArg, _);\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\n    }\n};\n// Configuration globale\nvar CANVAS_ID = \"myCanvas\";\nvar BG_RECT = { x: 0, y: 0, w: 1050, h: 1050 };\nvar MOUSE = { x: 0, y: 0 };\nvar FPS = 30;\nvar FRAME_INTERVAL = 1000 / FPS;\n// variables globales\nvar DECKS = [];\nvar HANDS = [];\nvar GAME;\n// Optimisation des références\nvar animationFrameId;\nvar lastFrameTime = 0;\nvar callbacks = [];\n// Pré-calcul des dimensions\nvar canvas = document.getElementById(CANVAS_ID);\nvar ctx = canvas.getContext(\"2d\");\ncanvas.width = BG_RECT.w;\ncanvas.height = BG_RECT.h;\n// Cache statique\nvar staticCanvas = document.createElement('canvas');\nvar staticCtx = staticCanvas.getContext(\"2d\");\nstaticCanvas.width = canvas.width;\nstaticCanvas.height = canvas.height;\nfunction drawFrame() {\n    if (!ctx)\n        return;\n    GAME === null || GAME === void 0 ? void 0 : GAME.draw(MOUSE);\n}\nfunction animationLoop(currentTime) {\n    animationFrameId = requestAnimationFrame(animationLoop);\n    var deltaTime = currentTime - lastFrameTime;\n    if (deltaTime < FRAME_INTERVAL)\n        return;\n    lastFrameTime = currentTime - (deltaTime % FRAME_INTERVAL);\n    drawFrame();\n}\nfunction initEventListeners() {\n    var handlers = {\n        mousedown: function (e) {\n            GAME === null || GAME === void 0 ? void 0 : GAME.click(e);\n        },\n        mousemove: function (e) {\n            MOUSE.x = e.x;\n            MOUSE.y = e.y;\n        }\n    };\n    callbacks.push(function () {\n        canvas.removeEventListener('mousemove', handlers.mousemove);\n    });\n    canvas.addEventListener('mousedown', handlers.mousedown);\n}\nfunction preloadDeck(deck) {\n    return __awaiter(this, void 0, void 0, function () {\n        return __generator(this, function (_a) {\n            switch (_a.label) {\n                case 0: return [4 /*yield*/, deck.preload()];\n                case 1:\n                    _a.sent();\n                    return [2 /*return*/];\n            }\n        });\n    });\n}\nfunction preloadHand(hand) {\n    return __awaiter(this, void 0, void 0, function () {\n        return __generator(this, function (_a) {\n            switch (_a.label) {\n                case 0: return [4 /*yield*/, hand.preload()];\n                case 1:\n                    _a.sent();\n                    return [2 /*return*/];\n            }\n        });\n    });\n}\nfunction cleanup() {\n    cancelAnimationFrame(animationFrameId);\n    callbacks.forEach(function (fn) { return fn(); });\n}\nfunction initDisplay() {\n    return __awaiter(this, void 0, void 0, function () {\n        return __generator(this, function (_a) {\n            if (!ctx) {\n                console.error(\"Context canvas indisponible\");\n                return [2 /*return*/];\n            }\n            console.log(\"Load begining\\n\");\n            return [2 /*return*/];\n        });\n    });\n}\n// Initialisation automatique si le script est chargé directement\nif (typeof window !== 'undefined') {\n    initDisplay().catch(console.error);\n}\n\n\n//# sourceURL=webpack:///./src/display/dp5.ts?");

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