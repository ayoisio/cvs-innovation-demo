"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/mdast-util-gfm-autolink-literal";
exports.ids = ["vendor-chunks/mdast-util-gfm-autolink-literal"];
exports.modules = {

/***/ "(ssr)/./node_modules/mdast-util-gfm-autolink-literal/lib/index.js":
/*!*******************************************************************!*\
  !*** ./node_modules/mdast-util-gfm-autolink-literal/lib/index.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   gfmAutolinkLiteralFromMarkdown: () => (/* binding */ gfmAutolinkLiteralFromMarkdown),\n/* harmony export */   gfmAutolinkLiteralToMarkdown: () => (/* binding */ gfmAutolinkLiteralToMarkdown)\n/* harmony export */ });\n/* harmony import */ var ccount__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ccount */ \"(ssr)/./node_modules/ccount/index.js\");\n/* harmony import */ var devlop__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! devlop */ \"(ssr)/./node_modules/devlop/lib/development.js\");\n/* harmony import */ var micromark_util_character__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-util-character */ \"(ssr)/./node_modules/micromark-util-character/dev/index.js\");\n/* harmony import */ var mdast_util_find_and_replace__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mdast-util-find-and-replace */ \"(ssr)/./node_modules/mdast-util-find-and-replace/lib/index.js\");\n/**\n * @typedef {import('mdast').Link} Link\n * @typedef {import('mdast').PhrasingContent} PhrasingContent\n *\n * @typedef {import('mdast-util-from-markdown').CompileContext} CompileContext\n * @typedef {import('mdast-util-from-markdown').Extension} FromMarkdownExtension\n * @typedef {import('mdast-util-from-markdown').Handle} FromMarkdownHandle\n * @typedef {import('mdast-util-from-markdown').Transform} FromMarkdownTransform\n *\n * @typedef {import('mdast-util-to-markdown').ConstructName} ConstructName\n * @typedef {import('mdast-util-to-markdown').Options} ToMarkdownExtension\n *\n * @typedef {import('mdast-util-find-and-replace').RegExpMatchObject} RegExpMatchObject\n * @typedef {import('mdast-util-find-and-replace').ReplaceFunction} ReplaceFunction\n */\n\n\n\n\n\n\n/** @type {ConstructName} */\nconst inConstruct = 'phrasing'\n/** @type {Array<ConstructName>} */\nconst notInConstruct = ['autolink', 'link', 'image', 'label']\n\n/**\n * Create an extension for `mdast-util-from-markdown` to enable GFM autolink\n * literals in markdown.\n *\n * @returns {FromMarkdownExtension}\n *   Extension for `mdast-util-to-markdown` to enable GFM autolink literals.\n */\nfunction gfmAutolinkLiteralFromMarkdown() {\n  return {\n    transforms: [transformGfmAutolinkLiterals],\n    enter: {\n      literalAutolink: enterLiteralAutolink,\n      literalAutolinkEmail: enterLiteralAutolinkValue,\n      literalAutolinkHttp: enterLiteralAutolinkValue,\n      literalAutolinkWww: enterLiteralAutolinkValue\n    },\n    exit: {\n      literalAutolink: exitLiteralAutolink,\n      literalAutolinkEmail: exitLiteralAutolinkEmail,\n      literalAutolinkHttp: exitLiteralAutolinkHttp,\n      literalAutolinkWww: exitLiteralAutolinkWww\n    }\n  }\n}\n\n/**\n * Create an extension for `mdast-util-to-markdown` to enable GFM autolink\n * literals in markdown.\n *\n * @returns {ToMarkdownExtension}\n *   Extension for `mdast-util-to-markdown` to enable GFM autolink literals.\n */\nfunction gfmAutolinkLiteralToMarkdown() {\n  return {\n    unsafe: [\n      {\n        character: '@',\n        before: '[+\\\\-.\\\\w]',\n        after: '[\\\\-.\\\\w]',\n        inConstruct,\n        notInConstruct\n      },\n      {\n        character: '.',\n        before: '[Ww]',\n        after: '[\\\\-.\\\\w]',\n        inConstruct,\n        notInConstruct\n      },\n      {\n        character: ':',\n        before: '[ps]',\n        after: '\\\\/',\n        inConstruct,\n        notInConstruct\n      }\n    ]\n  }\n}\n\n/**\n * @this {CompileContext}\n * @type {FromMarkdownHandle}\n */\nfunction enterLiteralAutolink(token) {\n  this.enter({type: 'link', title: null, url: '', children: []}, token)\n}\n\n/**\n * @this {CompileContext}\n * @type {FromMarkdownHandle}\n */\nfunction enterLiteralAutolinkValue(token) {\n  this.config.enter.autolinkProtocol.call(this, token)\n}\n\n/**\n * @this {CompileContext}\n * @type {FromMarkdownHandle}\n */\nfunction exitLiteralAutolinkHttp(token) {\n  this.config.exit.autolinkProtocol.call(this, token)\n}\n\n/**\n * @this {CompileContext}\n * @type {FromMarkdownHandle}\n */\nfunction exitLiteralAutolinkWww(token) {\n  this.config.exit.data.call(this, token)\n  const node = this.stack[this.stack.length - 1]\n  ;(0,devlop__WEBPACK_IMPORTED_MODULE_0__.ok)(node.type === 'link')\n  node.url = 'http://' + this.sliceSerialize(token)\n}\n\n/**\n * @this {CompileContext}\n * @type {FromMarkdownHandle}\n */\nfunction exitLiteralAutolinkEmail(token) {\n  this.config.exit.autolinkEmail.call(this, token)\n}\n\n/**\n * @this {CompileContext}\n * @type {FromMarkdownHandle}\n */\nfunction exitLiteralAutolink(token) {\n  this.exit(token)\n}\n\n/** @type {FromMarkdownTransform} */\nfunction transformGfmAutolinkLiterals(tree) {\n  (0,mdast_util_find_and_replace__WEBPACK_IMPORTED_MODULE_1__.findAndReplace)(\n    tree,\n    [\n      [/(https?:\\/\\/|www(?=\\.))([-.\\w]+)([^ \\t\\r\\n]*)/gi, findUrl],\n      [/([-.\\w+]+)@([-\\w]+(?:\\.[-\\w]+)+)/g, findEmail]\n    ],\n    {ignore: ['link', 'linkReference']}\n  )\n}\n\n/**\n * @type {ReplaceFunction}\n * @param {string} _\n * @param {string} protocol\n * @param {string} domain\n * @param {string} path\n * @param {RegExpMatchObject} match\n * @returns {Array<PhrasingContent> | Link | false}\n */\n// eslint-disable-next-line max-params\nfunction findUrl(_, protocol, domain, path, match) {\n  let prefix = ''\n\n  // Not an expected previous character.\n  if (!previous(match)) {\n    return false\n  }\n\n  // Treat `www` as part of the domain.\n  if (/^w/i.test(protocol)) {\n    domain = protocol + domain\n    protocol = ''\n    prefix = 'http://'\n  }\n\n  if (!isCorrectDomain(domain)) {\n    return false\n  }\n\n  const parts = splitUrl(domain + path)\n\n  if (!parts[0]) return false\n\n  /** @type {Link} */\n  const result = {\n    type: 'link',\n    title: null,\n    url: prefix + protocol + parts[0],\n    children: [{type: 'text', value: protocol + parts[0]}]\n  }\n\n  if (parts[1]) {\n    return [result, {type: 'text', value: parts[1]}]\n  }\n\n  return result\n}\n\n/**\n * @type {ReplaceFunction}\n * @param {string} _\n * @param {string} atext\n * @param {string} label\n * @param {RegExpMatchObject} match\n * @returns {Link | false}\n */\nfunction findEmail(_, atext, label, match) {\n  if (\n    // Not an expected previous character.\n    !previous(match, true) ||\n    // Label ends in not allowed character.\n    /[-\\d_]$/.test(label)\n  ) {\n    return false\n  }\n\n  return {\n    type: 'link',\n    title: null,\n    url: 'mailto:' + atext + '@' + label,\n    children: [{type: 'text', value: atext + '@' + label}]\n  }\n}\n\n/**\n * @param {string} domain\n * @returns {boolean}\n */\nfunction isCorrectDomain(domain) {\n  const parts = domain.split('.')\n\n  if (\n    parts.length < 2 ||\n    (parts[parts.length - 1] &&\n      (/_/.test(parts[parts.length - 1]) ||\n        !/[a-zA-Z\\d]/.test(parts[parts.length - 1]))) ||\n    (parts[parts.length - 2] &&\n      (/_/.test(parts[parts.length - 2]) ||\n        !/[a-zA-Z\\d]/.test(parts[parts.length - 2])))\n  ) {\n    return false\n  }\n\n  return true\n}\n\n/**\n * @param {string} url\n * @returns {[string, string | undefined]}\n */\nfunction splitUrl(url) {\n  const trailExec = /[!\"&'),.:;<>?\\]}]+$/.exec(url)\n\n  if (!trailExec) {\n    return [url, undefined]\n  }\n\n  url = url.slice(0, trailExec.index)\n\n  let trail = trailExec[0]\n  let closingParenIndex = trail.indexOf(')')\n  const openingParens = (0,ccount__WEBPACK_IMPORTED_MODULE_2__.ccount)(url, '(')\n  let closingParens = (0,ccount__WEBPACK_IMPORTED_MODULE_2__.ccount)(url, ')')\n\n  while (closingParenIndex !== -1 && openingParens > closingParens) {\n    url += trail.slice(0, closingParenIndex + 1)\n    trail = trail.slice(closingParenIndex + 1)\n    closingParenIndex = trail.indexOf(')')\n    closingParens++\n  }\n\n  return [url, trail]\n}\n\n/**\n * @param {RegExpMatchObject} match\n * @param {boolean | null | undefined} [email=false]\n * @returns {boolean}\n */\nfunction previous(match, email) {\n  const code = match.input.charCodeAt(match.index - 1)\n\n  return (\n    (match.index === 0 ||\n      (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.unicodeWhitespace)(code) ||\n      (0,micromark_util_character__WEBPACK_IMPORTED_MODULE_3__.unicodePunctuation)(code)) &&\n    (!email || code !== 47)\n  )\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbWRhc3QtdXRpbC1nZm0tYXV0b2xpbmstbGl0ZXJhbC9saWIvaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQSxhQUFhLHNCQUFzQjtBQUNuQyxhQUFhLGlDQUFpQztBQUM5QztBQUNBLGFBQWEsbURBQW1EO0FBQ2hFLGFBQWEsOENBQThDO0FBQzNELGFBQWEsMkNBQTJDO0FBQ3hELGFBQWEsOENBQThDO0FBQzNEO0FBQ0EsYUFBYSxnREFBZ0Q7QUFDN0QsYUFBYSwwQ0FBMEM7QUFDdkQ7QUFDQSxhQUFhLHlEQUF5RDtBQUN0RSxhQUFhLHVEQUF1RDtBQUNwRTs7QUFFNkI7QUFDTTtBQUMyQztBQUNwQjs7QUFFMUQsV0FBVyxlQUFlO0FBQzFCO0FBQ0EsV0FBVyxzQkFBc0I7QUFDakM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFVBQVU7QUFDVixVQUFVO0FBQ1Y7QUFDQTtBQUNBLGNBQWMsaURBQWlEO0FBQy9EOztBQUVBO0FBQ0EsVUFBVTtBQUNWLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFVBQVU7QUFDVixVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxVQUFVO0FBQ1YsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSwyQ0FBTTtBQUNSO0FBQ0E7O0FBRUE7QUFDQSxVQUFVO0FBQ1YsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBVTtBQUNWLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXLHVCQUF1QjtBQUNsQztBQUNBLEVBQUUsMkVBQWM7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0EsVUFBVTtBQUNWLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLG1CQUFtQjtBQUM5QixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSxhQUFhLE1BQU07QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IseUNBQXlDO0FBQ3pEOztBQUVBO0FBQ0EscUJBQXFCLDhCQUE4QjtBQUNuRDs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsVUFBVTtBQUNWLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsbUJBQW1CO0FBQzlCLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQix5Q0FBeUM7QUFDekQ7QUFDQTs7QUFFQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhO0FBQ2I7QUFDQTtBQUNBLCtCQUErQixNQUFNOztBQUVyQztBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLHdCQUF3Qiw4Q0FBTTtBQUM5QixzQkFBc0IsOENBQU07O0FBRTVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsV0FBVyxtQkFBbUI7QUFDOUIsV0FBVyw0QkFBNEI7QUFDdkMsYUFBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTSwyRUFBaUI7QUFDdkIsTUFBTSw0RUFBa0I7QUFDeEI7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY3ZzLWlubm92YXRpb24tZGVtby13ZWItYXBwLy4vbm9kZV9tb2R1bGVzL21kYXN0LXV0aWwtZ2ZtLWF1dG9saW5rLWxpdGVyYWwvbGliL2luZGV4LmpzP2Q0ZWUiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCdtZGFzdCcpLkxpbmt9IExpbmtcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJ21kYXN0JykuUGhyYXNpbmdDb250ZW50fSBQaHJhc2luZ0NvbnRlbnRcbiAqXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCdtZGFzdC11dGlsLWZyb20tbWFya2Rvd24nKS5Db21waWxlQ29udGV4dH0gQ29tcGlsZUNvbnRleHRcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJ21kYXN0LXV0aWwtZnJvbS1tYXJrZG93bicpLkV4dGVuc2lvbn0gRnJvbU1hcmtkb3duRXh0ZW5zaW9uXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCdtZGFzdC11dGlsLWZyb20tbWFya2Rvd24nKS5IYW5kbGV9IEZyb21NYXJrZG93bkhhbmRsZVxuICogQHR5cGVkZWYge2ltcG9ydCgnbWRhc3QtdXRpbC1mcm9tLW1hcmtkb3duJykuVHJhbnNmb3JtfSBGcm9tTWFya2Rvd25UcmFuc2Zvcm1cbiAqXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCdtZGFzdC11dGlsLXRvLW1hcmtkb3duJykuQ29uc3RydWN0TmFtZX0gQ29uc3RydWN0TmFtZVxuICogQHR5cGVkZWYge2ltcG9ydCgnbWRhc3QtdXRpbC10by1tYXJrZG93bicpLk9wdGlvbnN9IFRvTWFya2Rvd25FeHRlbnNpb25cbiAqXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCdtZGFzdC11dGlsLWZpbmQtYW5kLXJlcGxhY2UnKS5SZWdFeHBNYXRjaE9iamVjdH0gUmVnRXhwTWF0Y2hPYmplY3RcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJ21kYXN0LXV0aWwtZmluZC1hbmQtcmVwbGFjZScpLlJlcGxhY2VGdW5jdGlvbn0gUmVwbGFjZUZ1bmN0aW9uXG4gKi9cblxuaW1wb3J0IHtjY291bnR9IGZyb20gJ2Njb3VudCdcbmltcG9ydCB7b2sgYXMgYXNzZXJ0fSBmcm9tICdkZXZsb3AnXG5pbXBvcnQge3VuaWNvZGVQdW5jdHVhdGlvbiwgdW5pY29kZVdoaXRlc3BhY2V9IGZyb20gJ21pY3JvbWFyay11dGlsLWNoYXJhY3RlcidcbmltcG9ydCB7ZmluZEFuZFJlcGxhY2V9IGZyb20gJ21kYXN0LXV0aWwtZmluZC1hbmQtcmVwbGFjZSdcblxuLyoqIEB0eXBlIHtDb25zdHJ1Y3ROYW1lfSAqL1xuY29uc3QgaW5Db25zdHJ1Y3QgPSAncGhyYXNpbmcnXG4vKiogQHR5cGUge0FycmF5PENvbnN0cnVjdE5hbWU+fSAqL1xuY29uc3Qgbm90SW5Db25zdHJ1Y3QgPSBbJ2F1dG9saW5rJywgJ2xpbmsnLCAnaW1hZ2UnLCAnbGFiZWwnXVxuXG4vKipcbiAqIENyZWF0ZSBhbiBleHRlbnNpb24gZm9yIGBtZGFzdC11dGlsLWZyb20tbWFya2Rvd25gIHRvIGVuYWJsZSBHRk0gYXV0b2xpbmtcbiAqIGxpdGVyYWxzIGluIG1hcmtkb3duLlxuICpcbiAqIEByZXR1cm5zIHtGcm9tTWFya2Rvd25FeHRlbnNpb259XG4gKiAgIEV4dGVuc2lvbiBmb3IgYG1kYXN0LXV0aWwtdG8tbWFya2Rvd25gIHRvIGVuYWJsZSBHRk0gYXV0b2xpbmsgbGl0ZXJhbHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZm1BdXRvbGlua0xpdGVyYWxGcm9tTWFya2Rvd24oKSB7XG4gIHJldHVybiB7XG4gICAgdHJhbnNmb3JtczogW3RyYW5zZm9ybUdmbUF1dG9saW5rTGl0ZXJhbHNdLFxuICAgIGVudGVyOiB7XG4gICAgICBsaXRlcmFsQXV0b2xpbms6IGVudGVyTGl0ZXJhbEF1dG9saW5rLFxuICAgICAgbGl0ZXJhbEF1dG9saW5rRW1haWw6IGVudGVyTGl0ZXJhbEF1dG9saW5rVmFsdWUsXG4gICAgICBsaXRlcmFsQXV0b2xpbmtIdHRwOiBlbnRlckxpdGVyYWxBdXRvbGlua1ZhbHVlLFxuICAgICAgbGl0ZXJhbEF1dG9saW5rV3d3OiBlbnRlckxpdGVyYWxBdXRvbGlua1ZhbHVlXG4gICAgfSxcbiAgICBleGl0OiB7XG4gICAgICBsaXRlcmFsQXV0b2xpbms6IGV4aXRMaXRlcmFsQXV0b2xpbmssXG4gICAgICBsaXRlcmFsQXV0b2xpbmtFbWFpbDogZXhpdExpdGVyYWxBdXRvbGlua0VtYWlsLFxuICAgICAgbGl0ZXJhbEF1dG9saW5rSHR0cDogZXhpdExpdGVyYWxBdXRvbGlua0h0dHAsXG4gICAgICBsaXRlcmFsQXV0b2xpbmtXd3c6IGV4aXRMaXRlcmFsQXV0b2xpbmtXd3dcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgYW4gZXh0ZW5zaW9uIGZvciBgbWRhc3QtdXRpbC10by1tYXJrZG93bmAgdG8gZW5hYmxlIEdGTSBhdXRvbGlua1xuICogbGl0ZXJhbHMgaW4gbWFya2Rvd24uXG4gKlxuICogQHJldHVybnMge1RvTWFya2Rvd25FeHRlbnNpb259XG4gKiAgIEV4dGVuc2lvbiBmb3IgYG1kYXN0LXV0aWwtdG8tbWFya2Rvd25gIHRvIGVuYWJsZSBHRk0gYXV0b2xpbmsgbGl0ZXJhbHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZm1BdXRvbGlua0xpdGVyYWxUb01hcmtkb3duKCkge1xuICByZXR1cm4ge1xuICAgIHVuc2FmZTogW1xuICAgICAge1xuICAgICAgICBjaGFyYWN0ZXI6ICdAJyxcbiAgICAgICAgYmVmb3JlOiAnWytcXFxcLS5cXFxcd10nLFxuICAgICAgICBhZnRlcjogJ1tcXFxcLS5cXFxcd10nLFxuICAgICAgICBpbkNvbnN0cnVjdCxcbiAgICAgICAgbm90SW5Db25zdHJ1Y3RcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNoYXJhY3RlcjogJy4nLFxuICAgICAgICBiZWZvcmU6ICdbV3ddJyxcbiAgICAgICAgYWZ0ZXI6ICdbXFxcXC0uXFxcXHddJyxcbiAgICAgICAgaW5Db25zdHJ1Y3QsXG4gICAgICAgIG5vdEluQ29uc3RydWN0XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjaGFyYWN0ZXI6ICc6JyxcbiAgICAgICAgYmVmb3JlOiAnW3BzXScsXG4gICAgICAgIGFmdGVyOiAnXFxcXC8nLFxuICAgICAgICBpbkNvbnN0cnVjdCxcbiAgICAgICAgbm90SW5Db25zdHJ1Y3RcbiAgICAgIH1cbiAgICBdXG4gIH1cbn1cblxuLyoqXG4gKiBAdGhpcyB7Q29tcGlsZUNvbnRleHR9XG4gKiBAdHlwZSB7RnJvbU1hcmtkb3duSGFuZGxlfVxuICovXG5mdW5jdGlvbiBlbnRlckxpdGVyYWxBdXRvbGluayh0b2tlbikge1xuICB0aGlzLmVudGVyKHt0eXBlOiAnbGluaycsIHRpdGxlOiBudWxsLCB1cmw6ICcnLCBjaGlsZHJlbjogW119LCB0b2tlbilcbn1cblxuLyoqXG4gKiBAdGhpcyB7Q29tcGlsZUNvbnRleHR9XG4gKiBAdHlwZSB7RnJvbU1hcmtkb3duSGFuZGxlfVxuICovXG5mdW5jdGlvbiBlbnRlckxpdGVyYWxBdXRvbGlua1ZhbHVlKHRva2VuKSB7XG4gIHRoaXMuY29uZmlnLmVudGVyLmF1dG9saW5rUHJvdG9jb2wuY2FsbCh0aGlzLCB0b2tlbilcbn1cblxuLyoqXG4gKiBAdGhpcyB7Q29tcGlsZUNvbnRleHR9XG4gKiBAdHlwZSB7RnJvbU1hcmtkb3duSGFuZGxlfVxuICovXG5mdW5jdGlvbiBleGl0TGl0ZXJhbEF1dG9saW5rSHR0cCh0b2tlbikge1xuICB0aGlzLmNvbmZpZy5leGl0LmF1dG9saW5rUHJvdG9jb2wuY2FsbCh0aGlzLCB0b2tlbilcbn1cblxuLyoqXG4gKiBAdGhpcyB7Q29tcGlsZUNvbnRleHR9XG4gKiBAdHlwZSB7RnJvbU1hcmtkb3duSGFuZGxlfVxuICovXG5mdW5jdGlvbiBleGl0TGl0ZXJhbEF1dG9saW5rV3d3KHRva2VuKSB7XG4gIHRoaXMuY29uZmlnLmV4aXQuZGF0YS5jYWxsKHRoaXMsIHRva2VuKVxuICBjb25zdCBub2RlID0gdGhpcy5zdGFja1t0aGlzLnN0YWNrLmxlbmd0aCAtIDFdXG4gIGFzc2VydChub2RlLnR5cGUgPT09ICdsaW5rJylcbiAgbm9kZS51cmwgPSAnaHR0cDovLycgKyB0aGlzLnNsaWNlU2VyaWFsaXplKHRva2VuKVxufVxuXG4vKipcbiAqIEB0aGlzIHtDb21waWxlQ29udGV4dH1cbiAqIEB0eXBlIHtGcm9tTWFya2Rvd25IYW5kbGV9XG4gKi9cbmZ1bmN0aW9uIGV4aXRMaXRlcmFsQXV0b2xpbmtFbWFpbCh0b2tlbikge1xuICB0aGlzLmNvbmZpZy5leGl0LmF1dG9saW5rRW1haWwuY2FsbCh0aGlzLCB0b2tlbilcbn1cblxuLyoqXG4gKiBAdGhpcyB7Q29tcGlsZUNvbnRleHR9XG4gKiBAdHlwZSB7RnJvbU1hcmtkb3duSGFuZGxlfVxuICovXG5mdW5jdGlvbiBleGl0TGl0ZXJhbEF1dG9saW5rKHRva2VuKSB7XG4gIHRoaXMuZXhpdCh0b2tlbilcbn1cblxuLyoqIEB0eXBlIHtGcm9tTWFya2Rvd25UcmFuc2Zvcm19ICovXG5mdW5jdGlvbiB0cmFuc2Zvcm1HZm1BdXRvbGlua0xpdGVyYWxzKHRyZWUpIHtcbiAgZmluZEFuZFJlcGxhY2UoXG4gICAgdHJlZSxcbiAgICBbXG4gICAgICBbLyhodHRwcz86XFwvXFwvfHd3dyg/PVxcLikpKFstLlxcd10rKShbXiBcXHRcXHJcXG5dKikvZ2ksIGZpbmRVcmxdLFxuICAgICAgWy8oWy0uXFx3K10rKUAoWy1cXHddKyg/OlxcLlstXFx3XSspKykvZywgZmluZEVtYWlsXVxuICAgIF0sXG4gICAge2lnbm9yZTogWydsaW5rJywgJ2xpbmtSZWZlcmVuY2UnXX1cbiAgKVxufVxuXG4vKipcbiAqIEB0eXBlIHtSZXBsYWNlRnVuY3Rpb259XG4gKiBAcGFyYW0ge3N0cmluZ30gX1xuICogQHBhcmFtIHtzdHJpbmd9IHByb3RvY29sXG4gKiBAcGFyYW0ge3N0cmluZ30gZG9tYWluXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aFxuICogQHBhcmFtIHtSZWdFeHBNYXRjaE9iamVjdH0gbWF0Y2hcbiAqIEByZXR1cm5zIHtBcnJheTxQaHJhc2luZ0NvbnRlbnQ+IHwgTGluayB8IGZhbHNlfVxuICovXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LXBhcmFtc1xuZnVuY3Rpb24gZmluZFVybChfLCBwcm90b2NvbCwgZG9tYWluLCBwYXRoLCBtYXRjaCkge1xuICBsZXQgcHJlZml4ID0gJydcblxuICAvLyBOb3QgYW4gZXhwZWN0ZWQgcHJldmlvdXMgY2hhcmFjdGVyLlxuICBpZiAoIXByZXZpb3VzKG1hdGNoKSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgLy8gVHJlYXQgYHd3d2AgYXMgcGFydCBvZiB0aGUgZG9tYWluLlxuICBpZiAoL153L2kudGVzdChwcm90b2NvbCkpIHtcbiAgICBkb21haW4gPSBwcm90b2NvbCArIGRvbWFpblxuICAgIHByb3RvY29sID0gJydcbiAgICBwcmVmaXggPSAnaHR0cDovLydcbiAgfVxuXG4gIGlmICghaXNDb3JyZWN0RG9tYWluKGRvbWFpbikpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGNvbnN0IHBhcnRzID0gc3BsaXRVcmwoZG9tYWluICsgcGF0aClcblxuICBpZiAoIXBhcnRzWzBdKSByZXR1cm4gZmFsc2VcblxuICAvKiogQHR5cGUge0xpbmt9ICovXG4gIGNvbnN0IHJlc3VsdCA9IHtcbiAgICB0eXBlOiAnbGluaycsXG4gICAgdGl0bGU6IG51bGwsXG4gICAgdXJsOiBwcmVmaXggKyBwcm90b2NvbCArIHBhcnRzWzBdLFxuICAgIGNoaWxkcmVuOiBbe3R5cGU6ICd0ZXh0JywgdmFsdWU6IHByb3RvY29sICsgcGFydHNbMF19XVxuICB9XG5cbiAgaWYgKHBhcnRzWzFdKSB7XG4gICAgcmV0dXJuIFtyZXN1bHQsIHt0eXBlOiAndGV4dCcsIHZhbHVlOiBwYXJ0c1sxXX1dXG4gIH1cblxuICByZXR1cm4gcmVzdWx0XG59XG5cbi8qKlxuICogQHR5cGUge1JlcGxhY2VGdW5jdGlvbn1cbiAqIEBwYXJhbSB7c3RyaW5nfSBfXG4gKiBAcGFyYW0ge3N0cmluZ30gYXRleHRcbiAqIEBwYXJhbSB7c3RyaW5nfSBsYWJlbFxuICogQHBhcmFtIHtSZWdFeHBNYXRjaE9iamVjdH0gbWF0Y2hcbiAqIEByZXR1cm5zIHtMaW5rIHwgZmFsc2V9XG4gKi9cbmZ1bmN0aW9uIGZpbmRFbWFpbChfLCBhdGV4dCwgbGFiZWwsIG1hdGNoKSB7XG4gIGlmIChcbiAgICAvLyBOb3QgYW4gZXhwZWN0ZWQgcHJldmlvdXMgY2hhcmFjdGVyLlxuICAgICFwcmV2aW91cyhtYXRjaCwgdHJ1ZSkgfHxcbiAgICAvLyBMYWJlbCBlbmRzIGluIG5vdCBhbGxvd2VkIGNoYXJhY3Rlci5cbiAgICAvWy1cXGRfXSQvLnRlc3QobGFiZWwpXG4gICkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnbGluaycsXG4gICAgdGl0bGU6IG51bGwsXG4gICAgdXJsOiAnbWFpbHRvOicgKyBhdGV4dCArICdAJyArIGxhYmVsLFxuICAgIGNoaWxkcmVuOiBbe3R5cGU6ICd0ZXh0JywgdmFsdWU6IGF0ZXh0ICsgJ0AnICsgbGFiZWx9XVxuICB9XG59XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IGRvbWFpblxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzQ29ycmVjdERvbWFpbihkb21haW4pIHtcbiAgY29uc3QgcGFydHMgPSBkb21haW4uc3BsaXQoJy4nKVxuXG4gIGlmIChcbiAgICBwYXJ0cy5sZW5ndGggPCAyIHx8XG4gICAgKHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdICYmXG4gICAgICAoL18vLnRlc3QocGFydHNbcGFydHMubGVuZ3RoIC0gMV0pIHx8XG4gICAgICAgICEvW2EtekEtWlxcZF0vLnRlc3QocGFydHNbcGFydHMubGVuZ3RoIC0gMV0pKSkgfHxcbiAgICAocGFydHNbcGFydHMubGVuZ3RoIC0gMl0gJiZcbiAgICAgICgvXy8udGVzdChwYXJ0c1twYXJ0cy5sZW5ndGggLSAyXSkgfHxcbiAgICAgICAgIS9bYS16QS1aXFxkXS8udGVzdChwYXJ0c1twYXJ0cy5sZW5ndGggLSAyXSkpKVxuICApIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHJldHVybiB0cnVlXG59XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybFxuICogQHJldHVybnMge1tzdHJpbmcsIHN0cmluZyB8IHVuZGVmaW5lZF19XG4gKi9cbmZ1bmN0aW9uIHNwbGl0VXJsKHVybCkge1xuICBjb25zdCB0cmFpbEV4ZWMgPSAvWyFcIiYnKSwuOjs8Pj9cXF19XSskLy5leGVjKHVybClcblxuICBpZiAoIXRyYWlsRXhlYykge1xuICAgIHJldHVybiBbdXJsLCB1bmRlZmluZWRdXG4gIH1cblxuICB1cmwgPSB1cmwuc2xpY2UoMCwgdHJhaWxFeGVjLmluZGV4KVxuXG4gIGxldCB0cmFpbCA9IHRyYWlsRXhlY1swXVxuICBsZXQgY2xvc2luZ1BhcmVuSW5kZXggPSB0cmFpbC5pbmRleE9mKCcpJylcbiAgY29uc3Qgb3BlbmluZ1BhcmVucyA9IGNjb3VudCh1cmwsICcoJylcbiAgbGV0IGNsb3NpbmdQYXJlbnMgPSBjY291bnQodXJsLCAnKScpXG5cbiAgd2hpbGUgKGNsb3NpbmdQYXJlbkluZGV4ICE9PSAtMSAmJiBvcGVuaW5nUGFyZW5zID4gY2xvc2luZ1BhcmVucykge1xuICAgIHVybCArPSB0cmFpbC5zbGljZSgwLCBjbG9zaW5nUGFyZW5JbmRleCArIDEpXG4gICAgdHJhaWwgPSB0cmFpbC5zbGljZShjbG9zaW5nUGFyZW5JbmRleCArIDEpXG4gICAgY2xvc2luZ1BhcmVuSW5kZXggPSB0cmFpbC5pbmRleE9mKCcpJylcbiAgICBjbG9zaW5nUGFyZW5zKytcbiAgfVxuXG4gIHJldHVybiBbdXJsLCB0cmFpbF1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge1JlZ0V4cE1hdGNoT2JqZWN0fSBtYXRjaFxuICogQHBhcmFtIHtib29sZWFuIHwgbnVsbCB8IHVuZGVmaW5lZH0gW2VtYWlsPWZhbHNlXVxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIHByZXZpb3VzKG1hdGNoLCBlbWFpbCkge1xuICBjb25zdCBjb2RlID0gbWF0Y2guaW5wdXQuY2hhckNvZGVBdChtYXRjaC5pbmRleCAtIDEpXG5cbiAgcmV0dXJuIChcbiAgICAobWF0Y2guaW5kZXggPT09IDAgfHxcbiAgICAgIHVuaWNvZGVXaGl0ZXNwYWNlKGNvZGUpIHx8XG4gICAgICB1bmljb2RlUHVuY3R1YXRpb24oY29kZSkpICYmXG4gICAgKCFlbWFpbCB8fCBjb2RlICE9PSA0NylcbiAgKVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/mdast-util-gfm-autolink-literal/lib/index.js\n");

/***/ })

};
;