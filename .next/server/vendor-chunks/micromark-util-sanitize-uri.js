"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/micromark-util-sanitize-uri";
exports.ids = ["vendor-chunks/micromark-util-sanitize-uri"];
exports.modules = {

/***/ "(ssr)/./node_modules/micromark-util-sanitize-uri/dev/index.js":
/*!***************************************************************!*\
  !*** ./node_modules/micromark-util-sanitize-uri/dev/index.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   normalizeUri: () => (/* binding */ normalizeUri),\n/* harmony export */   sanitizeUri: () => (/* binding */ sanitizeUri)\n/* harmony export */ });\n/* harmony import */ var micromark_util_character__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-character */ \"(ssr)/./node_modules/micromark-util-character/dev/index.js\");\n/* harmony import */ var micromark_util_encode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! micromark-util-encode */ \"(ssr)/./node_modules/micromark-util-encode/index.js\");\n/* harmony import */ var micromark_util_symbol__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-symbol */ \"(ssr)/./node_modules/micromark-util-symbol/lib/codes.js\");\n/* harmony import */ var micromark_util_symbol__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-util-symbol */ \"(ssr)/./node_modules/micromark-util-symbol/lib/values.js\");\n\n\n\n\n/**\n * Make a value safe for injection as a URL.\n *\n * This encodes unsafe characters with percent-encoding and skips already\n * encoded sequences (see `normalizeUri`).\n * Further unsafe characters are encoded as character references (see\n * `micromark-util-encode`).\n *\n * A regex of allowed protocols can be given, in which case the URL is\n * sanitized.\n * For example, `/^(https?|ircs?|mailto|xmpp)$/i` can be used for `a[href]`, or\n * `/^https?$/i` for `img[src]` (this is what `github.com` allows).\n * If the URL includes an unknown protocol (one not matched by `protocol`, such\n * as a dangerous example, `javascript:`), the value is ignored.\n *\n * @param {string | null | undefined} url\n *   URI to sanitize.\n * @param {RegExp | null | undefined} [protocol]\n *   Allowed protocols.\n * @returns {string}\n *   Sanitized URI.\n */\nfunction sanitizeUri(url, protocol) {\n  const value = (0,micromark_util_encode__WEBPACK_IMPORTED_MODULE_0__.encode)(normalizeUri(url || ''))\n\n  if (!protocol) {\n    return value\n  }\n\n  const colon = value.indexOf(':')\n  const questionMark = value.indexOf('?')\n  const numberSign = value.indexOf('#')\n  const slash = value.indexOf('/')\n\n  if (\n    // If there is no protocol, it’s relative.\n    colon < 0 ||\n    // If the first colon is after a `?`, `#`, or `/`, it’s not a protocol.\n    (slash > -1 && colon > slash) ||\n    (questionMark > -1 && colon > questionMark) ||\n    (numberSign > -1 && colon > numberSign) ||\n    // It is a protocol, it should be allowed.\n    protocol.test(value.slice(0, colon))\n  ) {\n    return value\n  }\n\n  return ''\n}\n\n/**\n * Normalize a URL.\n *\n * Encode unsafe characters with percent-encoding, skipping already encoded\n * sequences.\n *\n * @param {string} value\n *   URI to normalize.\n * @returns {string}\n *   Normalized URI.\n */\nfunction normalizeUri(value) {\n  /** @type {Array<string>} */\n  const result = []\n  let index = -1\n  let start = 0\n  let skip = 0\n\n  while (++index < value.length) {\n    const code = value.charCodeAt(index)\n    /** @type {string} */\n    let replace = ''\n\n    // A correct percent encoded value.\n    if (\n      code === micromark_util_symbol__WEBPACK_IMPORTED_MODULE_1__.codes.percentSign &&\n      (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_2__.asciiAlphanumeric)(value.charCodeAt(index + 1)) &&\n      (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_2__.asciiAlphanumeric)(value.charCodeAt(index + 2))\n    ) {\n      skip = 2\n    }\n    // ASCII.\n    else if (code < 128) {\n      if (!/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(code))) {\n        replace = String.fromCharCode(code)\n      }\n    }\n    // Astral.\n    else if (code > 55_295 && code < 57_344) {\n      const next = value.charCodeAt(index + 1)\n\n      // A correct surrogate pair.\n      if (code < 56_320 && next > 56_319 && next < 57_344) {\n        replace = String.fromCharCode(code, next)\n        skip = 1\n      }\n      // Lone surrogate.\n      else {\n        replace = micromark_util_symbol__WEBPACK_IMPORTED_MODULE_3__.values.replacementCharacter\n      }\n    }\n    // Unicode.\n    else {\n      replace = String.fromCharCode(code)\n    }\n\n    if (replace) {\n      result.push(value.slice(start, index), encodeURIComponent(replace))\n      start = index + skip + 1\n      replace = ''\n    }\n\n    if (skip) {\n      index += skip\n      skip = 0\n    }\n  }\n\n  return result.join('') + value.slice(start)\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbWljcm9tYXJrLXV0aWwtc2FuaXRpemUtdXJpL2Rldi9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBMEQ7QUFDZDtBQUNPOztBQUVuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLDJCQUEyQjtBQUN0QztBQUNBLFdBQVcsMkJBQTJCO0FBQ3RDO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDTztBQUNQLGdCQUFnQiw2REFBTTs7QUFFdEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ087QUFDUCxhQUFhLGVBQWU7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2Qjs7QUFFQTtBQUNBO0FBQ0EsZUFBZSx3REFBSztBQUNwQixNQUFNLDJFQUFpQjtBQUN2QixNQUFNLDJFQUFpQjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQix5REFBTTtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jdnMtaW5ub3ZhdGlvbi1kZW1vLXdlYi1hcHAvLi9ub2RlX21vZHVsZXMvbWljcm9tYXJrLXV0aWwtc2FuaXRpemUtdXJpL2Rldi9pbmRleC5qcz9mZTQ1Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXNjaWlBbHBoYW51bWVyaWN9IGZyb20gJ21pY3JvbWFyay11dGlsLWNoYXJhY3RlcidcbmltcG9ydCB7ZW5jb2RlfSBmcm9tICdtaWNyb21hcmstdXRpbC1lbmNvZGUnXG5pbXBvcnQge2NvZGVzLCB2YWx1ZXN9IGZyb20gJ21pY3JvbWFyay11dGlsLXN5bWJvbCdcblxuLyoqXG4gKiBNYWtlIGEgdmFsdWUgc2FmZSBmb3IgaW5qZWN0aW9uIGFzIGEgVVJMLlxuICpcbiAqIFRoaXMgZW5jb2RlcyB1bnNhZmUgY2hhcmFjdGVycyB3aXRoIHBlcmNlbnQtZW5jb2RpbmcgYW5kIHNraXBzIGFscmVhZHlcbiAqIGVuY29kZWQgc2VxdWVuY2VzIChzZWUgYG5vcm1hbGl6ZVVyaWApLlxuICogRnVydGhlciB1bnNhZmUgY2hhcmFjdGVycyBhcmUgZW5jb2RlZCBhcyBjaGFyYWN0ZXIgcmVmZXJlbmNlcyAoc2VlXG4gKiBgbWljcm9tYXJrLXV0aWwtZW5jb2RlYCkuXG4gKlxuICogQSByZWdleCBvZiBhbGxvd2VkIHByb3RvY29scyBjYW4gYmUgZ2l2ZW4sIGluIHdoaWNoIGNhc2UgdGhlIFVSTCBpc1xuICogc2FuaXRpemVkLlxuICogRm9yIGV4YW1wbGUsIGAvXihodHRwcz98aXJjcz98bWFpbHRvfHhtcHApJC9pYCBjYW4gYmUgdXNlZCBmb3IgYGFbaHJlZl1gLCBvclxuICogYC9eaHR0cHM/JC9pYCBmb3IgYGltZ1tzcmNdYCAodGhpcyBpcyB3aGF0IGBnaXRodWIuY29tYCBhbGxvd3MpLlxuICogSWYgdGhlIFVSTCBpbmNsdWRlcyBhbiB1bmtub3duIHByb3RvY29sIChvbmUgbm90IG1hdGNoZWQgYnkgYHByb3RvY29sYCwgc3VjaFxuICogYXMgYSBkYW5nZXJvdXMgZXhhbXBsZSwgYGphdmFzY3JpcHQ6YCksIHRoZSB2YWx1ZSBpcyBpZ25vcmVkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZH0gdXJsXG4gKiAgIFVSSSB0byBzYW5pdGl6ZS5cbiAqIEBwYXJhbSB7UmVnRXhwIHwgbnVsbCB8IHVuZGVmaW5lZH0gW3Byb3RvY29sXVxuICogICBBbGxvd2VkIHByb3RvY29scy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKiAgIFNhbml0aXplZCBVUkkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYW5pdGl6ZVVyaSh1cmwsIHByb3RvY29sKSB7XG4gIGNvbnN0IHZhbHVlID0gZW5jb2RlKG5vcm1hbGl6ZVVyaSh1cmwgfHwgJycpKVxuXG4gIGlmICghcHJvdG9jb2wpIHtcbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuXG4gIGNvbnN0IGNvbG9uID0gdmFsdWUuaW5kZXhPZignOicpXG4gIGNvbnN0IHF1ZXN0aW9uTWFyayA9IHZhbHVlLmluZGV4T2YoJz8nKVxuICBjb25zdCBudW1iZXJTaWduID0gdmFsdWUuaW5kZXhPZignIycpXG4gIGNvbnN0IHNsYXNoID0gdmFsdWUuaW5kZXhPZignLycpXG5cbiAgaWYgKFxuICAgIC8vIElmIHRoZXJlIGlzIG5vIHByb3RvY29sLCBpdOKAmXMgcmVsYXRpdmUuXG4gICAgY29sb24gPCAwIHx8XG4gICAgLy8gSWYgdGhlIGZpcnN0IGNvbG9uIGlzIGFmdGVyIGEgYD9gLCBgI2AsIG9yIGAvYCwgaXTigJlzIG5vdCBhIHByb3RvY29sLlxuICAgIChzbGFzaCA+IC0xICYmIGNvbG9uID4gc2xhc2gpIHx8XG4gICAgKHF1ZXN0aW9uTWFyayA+IC0xICYmIGNvbG9uID4gcXVlc3Rpb25NYXJrKSB8fFxuICAgIChudW1iZXJTaWduID4gLTEgJiYgY29sb24gPiBudW1iZXJTaWduKSB8fFxuICAgIC8vIEl0IGlzIGEgcHJvdG9jb2wsIGl0IHNob3VsZCBiZSBhbGxvd2VkLlxuICAgIHByb3RvY29sLnRlc3QodmFsdWUuc2xpY2UoMCwgY29sb24pKVxuICApIHtcbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuXG4gIHJldHVybiAnJ1xufVxuXG4vKipcbiAqIE5vcm1hbGl6ZSBhIFVSTC5cbiAqXG4gKiBFbmNvZGUgdW5zYWZlIGNoYXJhY3RlcnMgd2l0aCBwZXJjZW50LWVuY29kaW5nLCBza2lwcGluZyBhbHJlYWR5IGVuY29kZWRcbiAqIHNlcXVlbmNlcy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAqICAgVVJJIHRvIG5vcm1hbGl6ZS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKiAgIE5vcm1hbGl6ZWQgVVJJLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplVXJpKHZhbHVlKSB7XG4gIC8qKiBAdHlwZSB7QXJyYXk8c3RyaW5nPn0gKi9cbiAgY29uc3QgcmVzdWx0ID0gW11cbiAgbGV0IGluZGV4ID0gLTFcbiAgbGV0IHN0YXJ0ID0gMFxuICBsZXQgc2tpcCA9IDBcblxuICB3aGlsZSAoKytpbmRleCA8IHZhbHVlLmxlbmd0aCkge1xuICAgIGNvbnN0IGNvZGUgPSB2YWx1ZS5jaGFyQ29kZUF0KGluZGV4KVxuICAgIC8qKiBAdHlwZSB7c3RyaW5nfSAqL1xuICAgIGxldCByZXBsYWNlID0gJydcblxuICAgIC8vIEEgY29ycmVjdCBwZXJjZW50IGVuY29kZWQgdmFsdWUuXG4gICAgaWYgKFxuICAgICAgY29kZSA9PT0gY29kZXMucGVyY2VudFNpZ24gJiZcbiAgICAgIGFzY2lpQWxwaGFudW1lcmljKHZhbHVlLmNoYXJDb2RlQXQoaW5kZXggKyAxKSkgJiZcbiAgICAgIGFzY2lpQWxwaGFudW1lcmljKHZhbHVlLmNoYXJDb2RlQXQoaW5kZXggKyAyKSlcbiAgICApIHtcbiAgICAgIHNraXAgPSAyXG4gICAgfVxuICAgIC8vIEFTQ0lJLlxuICAgIGVsc2UgaWYgKGNvZGUgPCAxMjgpIHtcbiAgICAgIGlmICghL1shIyQmLTs9Py1aX2Eten5dLy50ZXN0KFN0cmluZy5mcm9tQ2hhckNvZGUoY29kZSkpKSB7XG4gICAgICAgIHJlcGxhY2UgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvZGUpXG4gICAgICB9XG4gICAgfVxuICAgIC8vIEFzdHJhbC5cbiAgICBlbHNlIGlmIChjb2RlID4gNTVfMjk1ICYmIGNvZGUgPCA1N18zNDQpIHtcbiAgICAgIGNvbnN0IG5leHQgPSB2YWx1ZS5jaGFyQ29kZUF0KGluZGV4ICsgMSlcblxuICAgICAgLy8gQSBjb3JyZWN0IHN1cnJvZ2F0ZSBwYWlyLlxuICAgICAgaWYgKGNvZGUgPCA1Nl8zMjAgJiYgbmV4dCA+IDU2XzMxOSAmJiBuZXh0IDwgNTdfMzQ0KSB7XG4gICAgICAgIHJlcGxhY2UgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvZGUsIG5leHQpXG4gICAgICAgIHNraXAgPSAxXG4gICAgICB9XG4gICAgICAvLyBMb25lIHN1cnJvZ2F0ZS5cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXBsYWNlID0gdmFsdWVzLnJlcGxhY2VtZW50Q2hhcmFjdGVyXG4gICAgICB9XG4gICAgfVxuICAgIC8vIFVuaWNvZGUuXG4gICAgZWxzZSB7XG4gICAgICByZXBsYWNlID0gU3RyaW5nLmZyb21DaGFyQ29kZShjb2RlKVxuICAgIH1cblxuICAgIGlmIChyZXBsYWNlKSB7XG4gICAgICByZXN1bHQucHVzaCh2YWx1ZS5zbGljZShzdGFydCwgaW5kZXgpLCBlbmNvZGVVUklDb21wb25lbnQocmVwbGFjZSkpXG4gICAgICBzdGFydCA9IGluZGV4ICsgc2tpcCArIDFcbiAgICAgIHJlcGxhY2UgPSAnJ1xuICAgIH1cblxuICAgIGlmIChza2lwKSB7XG4gICAgICBpbmRleCArPSBza2lwXG4gICAgICBza2lwID0gMFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQuam9pbignJykgKyB2YWx1ZS5zbGljZShzdGFydClcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/micromark-util-sanitize-uri/dev/index.js\n");

/***/ })

};
;