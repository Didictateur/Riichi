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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   drawText: () => (/* binding */ drawText)\n/* harmony export */ });\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __generator = (undefined && undefined.__generator) || function (thisArg, body) {\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === \"function\" ? Iterator : Object).prototype);\n    return g.next = verb(0), g[\"throw\"] = verb(1), g[\"return\"] = verb(2), typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\n    function verb(n) { return function (v) { return step([n, v]); }; }\n    function step(op) {\n        if (f) throw new TypeError(\"Generator is already executing.\");\n        while (g && (g = 0, op[0] && (_ = 0)), _) try {\n            if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\n            if (y = 0, t) op = [op[0] & 2, t.value];\n            switch (op[0]) {\n                case 0: case 1: t = op; break;\n                case 4: _.label++; return { value: op[1], done: false };\n                case 5: _.label++; y = op[1]; op = [0]; continue;\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\n                default:\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\n                    if (t[2]) _.ops.pop();\n                    _.trys.pop(); continue;\n            }\n            op = body.call(thisArg, _);\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\n    }\n};\nfunction drawText(filePath, ctx) {\n    return __awaiter(this, void 0, void 0, function () {\n        var fileContent, size, dl, ll, xx, defaultColor, readingColor, color, gras, italic, line, x, _i, fileContent_1, c;\n        return __generator(this, function (_a) {\n            switch (_a.label) {\n                case 0:\n                    console.log(filePath, \"\\n\");\n                    return [4 /*yield*/, fetch(filePath)\n                            .then(function (response) { return response.text(); })];\n                case 1:\n                    fileContent = _a.sent();\n                    size = 30;\n                    dl = 5;\n                    ll = 50;\n                    xx = 10;\n                    defaultColor = \"#ffffff\";\n                    ctx.fillStyle = defaultColor;\n                    ctx.font = size + \"px Garamond\";\n                    readingColor = false;\n                    color = \"\";\n                    gras = \"\";\n                    italic = \"\";\n                    line = 1;\n                    x = 0;\n                    for (_i = 0, fileContent_1 = fileContent; _i < fileContent_1.length; _i++) {\n                        c = fileContent_1[_i];\n                        if (c === '*') {\n                            if (gras === \"\") {\n                                gras = \"bold \";\n                            }\n                            else {\n                                gras = \"\";\n                            }\n                            ctx.font = italic + gras + size + \"px Garamond\";\n                        }\n                        else if (c === '~') {\n                            if (italic === \"\") {\n                                italic = \"italic \";\n                            }\n                            else {\n                                italic = \"\";\n                            }\n                            ctx.font = italic + gras + size + \"px Garamond\";\n                        }\n                        else if (c === '#') {\n                            color = \"#\";\n                            readingColor = true;\n                        }\n                        else if (c === '{') {\n                            readingColor = false;\n                            ctx.fillStyle = color;\n                        }\n                        else if (c === '}') {\n                            color = \"\";\n                            ctx.fillStyle = defaultColor;\n                        }\n                        else if (readingColor) {\n                            color += c;\n                        }\n                        else if (c === '\\n') {\n                            line++;\n                            x = 0;\n                        }\n                        else {\n                            ctx.fillText(c, xx + x, ll + line * (size + dl));\n                            x += ctx.measureText(c).width;\n                        }\n                    }\n                    return [2 /*return*/];\n            }\n        });\n    });\n}\n\n\n//# sourceURL=webpack:///./src/text/parse.ts?");

/***/ }),

/***/ "./src/text/txt2.ts":
/*!**************************!*\
  !*** ./src/text/txt2.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _parse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parse */ \"./src/text/parse.ts\");\n\nvar CANVAS_ID = \"myTextCanvas\";\nvar BG_RECT = { x: 0, y: 0, w: 800, h: 1050, color: \"#007733\" };\nvar canvas = document.getElementById(CANVAS_ID);\nvar ctx = canvas.getContext(\"2d\");\ncanvas.width = BG_RECT.w;\ncanvas.height = BG_RECT.h;\nvar path = \"src/text/\";\nctx.fillStyle = BG_RECT.color;\nctx.fillRect(BG_RECT.x, BG_RECT.y, BG_RECT.w, BG_RECT.h);\n(0,_parse__WEBPACK_IMPORTED_MODULE_0__.drawText)(path + \"txt2.txt\", ctx).catch(function (error) { return console.error(error); });\n\n\n//# sourceURL=webpack:///./src/text/txt2.ts?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/text/txt2.ts");
/******/ 	
/******/ })()
;