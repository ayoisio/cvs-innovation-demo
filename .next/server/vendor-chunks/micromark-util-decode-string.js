"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/micromark-util-decode-string";
exports.ids = ["vendor-chunks/micromark-util-decode-string"];
exports.modules = {

/***/ "(ssr)/./node_modules/micromark-util-decode-string/dev/index.js":
/*!****************************************************************!*\
  !*** ./node_modules/micromark-util-decode-string/dev/index.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   decodeString: () => (/* binding */ decodeString)\n/* harmony export */ });\n/* harmony import */ var decode_named_character_reference__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! decode-named-character-reference */ \"(ssr)/./node_modules/decode-named-character-reference/index.js\");\n/* harmony import */ var micromark_util_decode_numeric_character_reference__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-decode-numeric-character-reference */ \"(ssr)/./node_modules/micromark-util-decode-numeric-character-reference/dev/index.js\");\n/* harmony import */ var micromark_util_symbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! micromark-util-symbol */ \"(ssr)/./node_modules/micromark-util-symbol/lib/codes.js\");\n/* harmony import */ var micromark_util_symbol__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-symbol */ \"(ssr)/./node_modules/micromark-util-symbol/lib/constants.js\");\n\n\n\n\nconst characterEscapeOrReference =\n  /\\\\([!-/:-@[-`{-~])|&(#(?:\\d{1,7}|x[\\da-f]{1,6})|[\\da-z]{1,31});/gi\n\n/**\n * Decode markdown strings (which occur in places such as fenced code info\n * strings, destinations, labels, and titles).\n *\n * The “string” content type allows character escapes and -references.\n * This decodes those.\n *\n * @param {string} value\n *   Value to decode.\n * @returns {string}\n *   Decoded value.\n */\nfunction decodeString(value) {\n  return value.replace(characterEscapeOrReference, decode)\n}\n\n/**\n * @param {string} $0\n * @param {string} $1\n * @param {string} $2\n * @returns {string}\n */\nfunction decode($0, $1, $2) {\n  if ($1) {\n    // Escape.\n    return $1\n  }\n\n  // Reference.\n  const head = $2.charCodeAt(0)\n\n  if (head === micromark_util_symbol__WEBPACK_IMPORTED_MODULE_0__.codes.numberSign) {\n    const head = $2.charCodeAt(1)\n    const hex = head === micromark_util_symbol__WEBPACK_IMPORTED_MODULE_0__.codes.lowercaseX || head === micromark_util_symbol__WEBPACK_IMPORTED_MODULE_0__.codes.uppercaseX\n    return (0,micromark_util_decode_numeric_character_reference__WEBPACK_IMPORTED_MODULE_1__.decodeNumericCharacterReference)(\n      $2.slice(hex ? 2 : 1),\n      hex ? micromark_util_symbol__WEBPACK_IMPORTED_MODULE_2__.constants.numericBaseHexadecimal : micromark_util_symbol__WEBPACK_IMPORTED_MODULE_2__.constants.numericBaseDecimal\n    )\n  }\n\n  return (0,decode_named_character_reference__WEBPACK_IMPORTED_MODULE_3__.decodeNamedCharacterReference)($2) || $0\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbWljcm9tYXJrLXV0aWwtZGVjb2RlLXN0cmluZy9kZXYvaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBOEU7QUFDbUI7QUFDM0M7O0FBRXREO0FBQ0EsaUJBQWlCLGNBQWMsSUFBSSxVQUFVLElBQUksVUFBVSxLQUFLLEVBQUU7O0FBRWxFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDTztBQUNQO0FBQ0E7O0FBRUE7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsZUFBZSx3REFBSztBQUNwQjtBQUNBLHlCQUF5Qix3REFBSyx3QkFBd0Isd0RBQUs7QUFDM0QsV0FBVyxrSEFBK0I7QUFDMUM7QUFDQSxZQUFZLDREQUFTLDBCQUEwQiw0REFBUztBQUN4RDtBQUNBOztBQUVBLFNBQVMsK0ZBQTZCO0FBQ3RDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY3ZzLWlubm92YXRpb24tZGVtby13ZWItYXBwLy4vbm9kZV9tb2R1bGVzL21pY3JvbWFyay11dGlsLWRlY29kZS1zdHJpbmcvZGV2L2luZGV4LmpzPzE5OTUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtkZWNvZGVOYW1lZENoYXJhY3RlclJlZmVyZW5jZX0gZnJvbSAnZGVjb2RlLW5hbWVkLWNoYXJhY3Rlci1yZWZlcmVuY2UnXG5pbXBvcnQge2RlY29kZU51bWVyaWNDaGFyYWN0ZXJSZWZlcmVuY2V9IGZyb20gJ21pY3JvbWFyay11dGlsLWRlY29kZS1udW1lcmljLWNoYXJhY3Rlci1yZWZlcmVuY2UnXG5pbXBvcnQge2NvZGVzLCBjb25zdGFudHN9IGZyb20gJ21pY3JvbWFyay11dGlsLXN5bWJvbCdcblxuY29uc3QgY2hhcmFjdGVyRXNjYXBlT3JSZWZlcmVuY2UgPVxuICAvXFxcXChbIS0vOi1AWy1gey1+XSl8JigjKD86XFxkezEsN318eFtcXGRhLWZdezEsNn0pfFtcXGRhLXpdezEsMzF9KTsvZ2lcblxuLyoqXG4gKiBEZWNvZGUgbWFya2Rvd24gc3RyaW5ncyAod2hpY2ggb2NjdXIgaW4gcGxhY2VzIHN1Y2ggYXMgZmVuY2VkIGNvZGUgaW5mb1xuICogc3RyaW5ncywgZGVzdGluYXRpb25zLCBsYWJlbHMsIGFuZCB0aXRsZXMpLlxuICpcbiAqIFRoZSDigJxzdHJpbmfigJ0gY29udGVudCB0eXBlIGFsbG93cyBjaGFyYWN0ZXIgZXNjYXBlcyBhbmQgLXJlZmVyZW5jZXMuXG4gKiBUaGlzIGRlY29kZXMgdGhvc2UuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG4gKiAgIFZhbHVlIHRvIGRlY29kZS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKiAgIERlY29kZWQgdmFsdWUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWNvZGVTdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoY2hhcmFjdGVyRXNjYXBlT3JSZWZlcmVuY2UsIGRlY29kZSlcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gJDBcbiAqIEBwYXJhbSB7c3RyaW5nfSAkMVxuICogQHBhcmFtIHtzdHJpbmd9ICQyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBkZWNvZGUoJDAsICQxLCAkMikge1xuICBpZiAoJDEpIHtcbiAgICAvLyBFc2NhcGUuXG4gICAgcmV0dXJuICQxXG4gIH1cblxuICAvLyBSZWZlcmVuY2UuXG4gIGNvbnN0IGhlYWQgPSAkMi5jaGFyQ29kZUF0KDApXG5cbiAgaWYgKGhlYWQgPT09IGNvZGVzLm51bWJlclNpZ24pIHtcbiAgICBjb25zdCBoZWFkID0gJDIuY2hhckNvZGVBdCgxKVxuICAgIGNvbnN0IGhleCA9IGhlYWQgPT09IGNvZGVzLmxvd2VyY2FzZVggfHwgaGVhZCA9PT0gY29kZXMudXBwZXJjYXNlWFxuICAgIHJldHVybiBkZWNvZGVOdW1lcmljQ2hhcmFjdGVyUmVmZXJlbmNlKFxuICAgICAgJDIuc2xpY2UoaGV4ID8gMiA6IDEpLFxuICAgICAgaGV4ID8gY29uc3RhbnRzLm51bWVyaWNCYXNlSGV4YWRlY2ltYWwgOiBjb25zdGFudHMubnVtZXJpY0Jhc2VEZWNpbWFsXG4gICAgKVxuICB9XG5cbiAgcmV0dXJuIGRlY29kZU5hbWVkQ2hhcmFjdGVyUmVmZXJlbmNlKCQyKSB8fCAkMFxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/micromark-util-decode-string/dev/index.js\n");

/***/ })

};
;