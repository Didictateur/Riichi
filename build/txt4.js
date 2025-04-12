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

/***/ "./src/text/parse.ts":
/*!***************************!*\
  !*** ./src/text/parse.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   drawText: () => (/* binding */ drawText)\n/* harmony export */ });\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nfunction drawText(filePath, ctx) {\n    return __awaiter(this, void 0, void 0, function* () {\n        console.log(filePath, \"\\n\");\n        const fileContent = yield fetch(filePath)\n            .then(response => response.text());\n        const size = 30;\n        const dl = 5;\n        const ll = 50;\n        const xx = 10;\n        const defaultColor = \"#ffffff\";\n        ctx.fillStyle = defaultColor;\n        ctx.font = size + \"px Garamond\";\n        let readingColor = false;\n        let color = \"\";\n        let gras = \"\";\n        let italic = \"\";\n        let line = 1;\n        let x = 0;\n        for (var c of fileContent) {\n            if (c === '*') {\n                if (gras === \"\") {\n                    gras = \"bold \";\n                }\n                else {\n                    gras = \"\";\n                }\n                ctx.font = italic + gras + size + \"px Garamond\";\n            }\n            else if (c === '~') {\n                if (italic === \"\") {\n                    italic = \"italic \";\n                }\n                else {\n                    italic = \"\";\n                }\n                ctx.font = italic + gras + size + \"px Garamond\";\n            }\n            else if (c === '#') {\n                color = \"#\";\n                readingColor = true;\n            }\n            else if (c === '{') {\n                readingColor = false;\n                ctx.fillStyle = color;\n            }\n            else if (c === '}') {\n                color = \"\";\n                ctx.fillStyle = defaultColor;\n            }\n            else if (readingColor) {\n                color += c;\n            }\n            else if (c === '\\n') {\n                line++;\n                x = 0;\n            }\n            else {\n                ctx.fillText(c, xx + x, ll + line * (size + dl));\n                x += ctx.measureText(c).width;\n            }\n        }\n    });\n}\n\n\n//# sourceURL=webpack:///./src/text/parse.ts?");

/***/ }),

/***/ "./src/text/txt4.ts":
/*!**************************!*\
  !*** ./src/text/txt4.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _parse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parse */ \"./src/text/parse.ts\");\n\nconst CANVAS_ID = \"myTextCanvas\";\nconst BG_RECT = { x: 0, y: 0, w: 800, h: 1050, color: \"#007733\" };\nconst canvas = document.getElementById(CANVAS_ID);\nconst ctx = canvas.getContext(\"2d\");\ncanvas.width = BG_RECT.w;\ncanvas.height = BG_RECT.h;\nconst path = \"src/text/\";\nctx.fillStyle = BG_RECT.color;\nctx.fillRect(BG_RECT.x, BG_RECT.y, BG_RECT.w, BG_RECT.h);\n(0,_parse__WEBPACK_IMPORTED_MODULE_0__.drawText)(path + \"txt4.txt\", ctx).catch(error => console.error(error));\n\n\n//# sourceURL=webpack:///./src/text/txt4.ts?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/text/txt4.ts");
/******/ 	
/******/ })()
;