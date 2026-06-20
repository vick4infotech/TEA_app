"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/login/route";
exports.ids = ["app/api/auth/login/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "node:buffer":
/*!******************************!*\
  !*** external "node:buffer" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node:buffer");

/***/ }),

/***/ "node:crypto":
/*!******************************!*\
  !*** external "node:crypto" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node:crypto");

/***/ }),

/***/ "node:util":
/*!****************************!*\
  !*** external "node:util" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("node:util");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.js&appDir=C%3A%5CUsers%5CRotciv%5CDownloads%5CTEA-APP-final-resolved%5Ctea-app%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CRotciv%5CDownloads%5CTEA-APP-final-resolved%5Ctea-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.js&appDir=C%3A%5CUsers%5CRotciv%5CDownloads%5CTEA-APP-final-resolved%5Ctea-app%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CRotciv%5CDownloads%5CTEA-APP-final-resolved%5Ctea-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_Rotciv_Downloads_TEA_APP_final_resolved_tea_app_app_api_auth_login_route_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/auth/login/route.js */ \"(rsc)/./app/api/auth/login/route.js\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/login/route\",\n        pathname: \"/api/auth/login\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/login/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\Rotciv\\\\Downloads\\\\TEA-APP-final-resolved\\\\tea-app\\\\app\\\\api\\\\auth\\\\login\\\\route.js\",\n    nextConfigOutput,\n    userland: C_Users_Rotciv_Downloads_TEA_APP_final_resolved_tea_app_app_api_auth_login_route_js__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/auth/login/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGbG9naW4lMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkZsb2dpbiUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkZsb2dpbiUyRnJvdXRlLmpzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNSb3RjaXYlNUNEb3dubG9hZHMlNUNURUEtQVBQLWZpbmFsLXJlc29sdmVkJTVDdGVhLWFwcCU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9QyUzQSU1Q1VzZXJzJTVDUm90Y2l2JTVDRG93bmxvYWRzJTVDVEVBLUFQUC1maW5hbC1yZXNvbHZlZCU1Q3RlYS1hcHAmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFzRztBQUN2QztBQUNjO0FBQzhDO0FBQzNIO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnSEFBbUI7QUFDM0M7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsaUVBQWlFO0FBQ3pFO0FBQ0E7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDdUg7O0FBRXZIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGVhLWFwcC8/NzgwMiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCJDOlxcXFxVc2Vyc1xcXFxSb3RjaXZcXFxcRG93bmxvYWRzXFxcXFRFQS1BUFAtZmluYWwtcmVzb2x2ZWRcXFxcdGVhLWFwcFxcXFxhcHBcXFxcYXBpXFxcXGF1dGhcXFxcbG9naW5cXFxccm91dGUuanNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2F1dGgvbG9naW4vcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9hdXRoL2xvZ2luXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9hdXRoL2xvZ2luL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiQzpcXFxcVXNlcnNcXFxcUm90Y2l2XFxcXERvd25sb2Fkc1xcXFxURUEtQVBQLWZpbmFsLXJlc29sdmVkXFxcXHRlYS1hcHBcXFxcYXBwXFxcXGFwaVxcXFxhdXRoXFxcXGxvZ2luXFxcXHJvdXRlLmpzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS9hdXRoL2xvZ2luL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.js&appDir=C%3A%5CUsers%5CRotciv%5CDownloads%5CTEA-APP-final-resolved%5Ctea-app%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CRotciv%5CDownloads%5CTEA-APP-final-resolved%5Ctea-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/auth/login/route.js":
/*!*************************************!*\
  !*** ./app/api/auth/login/route.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST),\n/* harmony export */   dynamic: () => (/* binding */ dynamic),\n/* harmony export */   runtime: () => (/* binding */ runtime)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./lib/db.js\");\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.js\");\nconst runtime = \"nodejs\";\nconst dynamic = \"force-dynamic\";\n\n\n\nasync function POST(req) {\n    const { email, password } = await req.json();\n    const user = await _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.user.findUnique({\n        where: {\n            email\n        }\n    });\n    if (!user || !user.active || !await (0,_lib_auth__WEBPACK_IMPORTED_MODULE_2__.verifyPassword)(password, user.passwordHash)) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        error: \"Unauthorized\"\n    }, {\n        status: 401\n    });\n    await (0,_lib_auth__WEBPACK_IMPORTED_MODULE_2__.createSession)(user);\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        ok: true\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvbG9naW4vcm91dGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQU8sTUFBTUEsVUFBVSxTQUFTO0FBQ3pCLE1BQU1DLFVBQVUsZ0JBQWdCO0FBRUk7QUFDVDtBQUN5QjtBQUNwRCxlQUFlSyxLQUFLQyxHQUFHO0lBQzdCLE1BQU0sRUFBQ0MsS0FBSyxFQUFDQyxRQUFRLEVBQUMsR0FBQyxNQUFNRixJQUFJRyxJQUFJO0lBQ3JDLE1BQU1DLE9BQUssTUFBTVIsMkNBQU1BLENBQUNRLElBQUksQ0FBQ0MsVUFBVSxDQUFDO1FBQUNDLE9BQU07WUFBQ0w7UUFBSztJQUFDO0lBQ3RELElBQUcsQ0FBQ0csUUFBUSxDQUFDQSxLQUFLRyxNQUFNLElBQUksQ0FBRSxNQUFNVix5REFBY0EsQ0FBQ0ssVUFBU0UsS0FBS0ksWUFBWSxHQUFJLE9BQU9iLHFEQUFZQSxDQUFDUSxJQUFJLENBQUM7UUFBQ00sT0FBTTtJQUFjLEdBQUU7UUFBQ0MsUUFBTztJQUFHO0lBQzVJLE1BQU1aLHdEQUFhQSxDQUFDTTtJQUFPLE9BQU9ULHFEQUFZQSxDQUFDUSxJQUFJLENBQUM7UUFBQ1EsSUFBRztJQUFJO0FBQzdEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGVhLWFwcC8uL2FwcC9hcGkvYXV0aC9sb2dpbi9yb3V0ZS5qcz84ZjBkIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBydW50aW1lID0gJ25vZGVqcyc7XG5leHBvcnQgY29uc3QgZHluYW1pYyA9ICdmb3JjZS1keW5hbWljJztcblxuaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSAnQC9saWIvZGInO1xuaW1wb3J0IHsgdmVyaWZ5UGFzc3dvcmQsIGNyZWF0ZVNlc3Npb24gfSBmcm9tICdAL2xpYi9hdXRoJztcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcSl7XG4gY29uc3Qge2VtYWlsLHBhc3N3b3JkfT1hd2FpdCByZXEuanNvbigpO1xuIGNvbnN0IHVzZXI9YXdhaXQgcHJpc21hLnVzZXIuZmluZFVuaXF1ZSh7d2hlcmU6e2VtYWlsfX0pO1xuIGlmKCF1c2VyIHx8ICF1c2VyLmFjdGl2ZSB8fCAhKGF3YWl0IHZlcmlmeVBhc3N3b3JkKHBhc3N3b3JkLHVzZXIucGFzc3dvcmRIYXNoKSkpIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7ZXJyb3I6J1VuYXV0aG9yaXplZCd9LHtzdGF0dXM6NDAxfSk7XG4gYXdhaXQgY3JlYXRlU2Vzc2lvbih1c2VyKTsgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtvazp0cnVlfSk7XG59XG4iXSwibmFtZXMiOlsicnVudGltZSIsImR5bmFtaWMiLCJOZXh0UmVzcG9uc2UiLCJwcmlzbWEiLCJ2ZXJpZnlQYXNzd29yZCIsImNyZWF0ZVNlc3Npb24iLCJQT1NUIiwicmVxIiwiZW1haWwiLCJwYXNzd29yZCIsImpzb24iLCJ1c2VyIiwiZmluZFVuaXF1ZSIsIndoZXJlIiwiYWN0aXZlIiwicGFzc3dvcmRIYXNoIiwiZXJyb3IiLCJzdGF0dXMiLCJvayJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/login/route.js\n");

/***/ }),

/***/ "(rsc)/./lib/auth.js":
/*!*********************!*\
  !*** ./lib/auth.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   branchWhere: () => (/* binding */ branchWhere),\n/* harmony export */   canAccess: () => (/* binding */ canAccess),\n/* harmony export */   clearSession: () => (/* binding */ clearSession),\n/* harmony export */   createSession: () => (/* binding */ createSession),\n/* harmony export */   getCurrentUser: () => (/* binding */ getCurrentUser),\n/* harmony export */   getSession: () => (/* binding */ getSession),\n/* harmony export */   hashPassword: () => (/* binding */ hashPassword),\n/* harmony export */   requirePageUser: () => (/* binding */ requirePageUser),\n/* harmony export */   requireUser: () => (/* binding */ requireUser),\n/* harmony export */   verifyPassword: () => (/* binding */ verifyPassword)\n/* harmony export */ });\n/* harmony import */ var jose__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! jose */ \"(rsc)/./node_modules/jose/dist/node/esm/jwt/sign.js\");\n/* harmony import */ var jose__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! jose */ \"(rsc)/./node_modules/jose/dist/node/esm/jwt/verify.js\");\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/navigation */ \"(rsc)/./node_modules/next/dist/api/navigation.react-server.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./db */ \"(rsc)/./lib/db.js\");\n\n\n\n\n\nconst cookieName = \"tea_session\";\nconst key = new TextEncoder().encode(process.env.JWT_SECRET || \"local-development-secret-change-me\");\nasync function hashPassword(password) {\n    return bcryptjs__WEBPACK_IMPORTED_MODULE_2___default().hash(password, 12);\n}\nasync function verifyPassword(password, hash) {\n    return bcryptjs__WEBPACK_IMPORTED_MODULE_2___default().compare(password, hash);\n}\nasync function createSession(user) {\n    const token = await new jose__WEBPACK_IMPORTED_MODULE_4__.SignJWT({\n        id: user.id,\n        role: user.role,\n        branchId: user.branchId,\n        name: user.name,\n        email: user.email\n    }).setProtectedHeader({\n        alg: \"HS256\"\n    }).setIssuedAt().setExpirationTime(\"12h\").sign(key);\n    (0,next_headers__WEBPACK_IMPORTED_MODULE_0__.cookies)().set(cookieName, token, {\n        httpOnly: true,\n        sameSite: \"lax\",\n        secure: \"development\" === \"production\",\n        path: \"/\",\n        maxAge: 60 * 60 * 12\n    });\n}\nfunction clearSession() {\n    (0,next_headers__WEBPACK_IMPORTED_MODULE_0__.cookies)().delete(cookieName);\n}\nasync function getSession() {\n    const token = (0,next_headers__WEBPACK_IMPORTED_MODULE_0__.cookies)().get(cookieName)?.value;\n    if (!token) return null;\n    try {\n        const { payload } = await (0,jose__WEBPACK_IMPORTED_MODULE_5__.jwtVerify)(token, key);\n        return payload;\n    } catch  {\n        return null;\n    }\n}\nasync function getCurrentUser() {\n    const session = await getSession();\n    if (!session?.id) return null;\n    const user = await _db__WEBPACK_IMPORTED_MODULE_3__.prisma.user.findUnique({\n        where: {\n            id: String(session.id)\n        },\n        include: {\n            branch: true\n        }\n    });\n    if (!user || !user.active) return null;\n    return user;\n}\nasync function requireUser() {\n    const user = await getCurrentUser();\n    if (!user) throw new Error(\"Unauthorized\");\n    return user;\n}\nasync function requirePageUser() {\n    const user = await getCurrentUser();\n    if (!user) (0,next_navigation__WEBPACK_IMPORTED_MODULE_1__.redirect)(\"/login\");\n    return user;\n}\nfunction canAccess(user, allowed) {\n    return allowed.includes(user.role);\n}\nfunction branchWhere(user, field = \"branchId\") {\n    if (user.role === \"SUPER_ADMIN\" || user.role === \"SUPER_TRAINING_COORDINATOR\") return {};\n    return user.branchId ? {\n        [field]: user.branchId\n    } : {\n        [field]: \"__none__\"\n    };\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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ImltcG9ydCB7IFNpZ25KV1QsIGp3dFZlcmlmeSB9IGZyb20gJ2pvc2UnO1xuaW1wb3J0IHsgY29va2llcyB9IGZyb20gJ25leHQvaGVhZGVycyc7XG5pbXBvcnQgeyByZWRpcmVjdCB9IGZyb20gJ25leHQvbmF2aWdhdGlvbic7XG5pbXBvcnQgYmNyeXB0IGZyb20gJ2JjcnlwdGpzJztcbmltcG9ydCB7IHByaXNtYSB9IGZyb20gJy4vZGInO1xuXG5jb25zdCBjb29raWVOYW1lID0gJ3RlYV9zZXNzaW9uJztcbmNvbnN0IGtleSA9IG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZShwcm9jZXNzLmVudi5KV1RfU0VDUkVUIHx8ICdsb2NhbC1kZXZlbG9wbWVudC1zZWNyZXQtY2hhbmdlLW1lJyk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYXNoUGFzc3dvcmQocGFzc3dvcmQpIHsgcmV0dXJuIGJjcnlwdC5oYXNoKHBhc3N3b3JkLCAxMik7IH1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB2ZXJpZnlQYXNzd29yZChwYXNzd29yZCwgaGFzaCkgeyByZXR1cm4gYmNyeXB0LmNvbXBhcmUocGFzc3dvcmQsIGhhc2gpOyB9XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVTZXNzaW9uKHVzZXIpIHtcbiAgY29uc3QgdG9rZW4gPSBhd2FpdCBuZXcgU2lnbkpXVCh7IGlkOnVzZXIuaWQsIHJvbGU6dXNlci5yb2xlLCBicmFuY2hJZDp1c2VyLmJyYW5jaElkLCBuYW1lOnVzZXIubmFtZSwgZW1haWw6dXNlci5lbWFpbCB9KVxuICAgIC5zZXRQcm90ZWN0ZWRIZWFkZXIoeyBhbGc6ICdIUzI1NicgfSlcbiAgICAuc2V0SXNzdWVkQXQoKVxuICAgIC5zZXRFeHBpcmF0aW9uVGltZSgnMTJoJylcbiAgICAuc2lnbihrZXkpO1xuICBjb29raWVzKCkuc2V0KGNvb2tpZU5hbWUsIHRva2VuLCB7IGh0dHBPbmx5OnRydWUsIHNhbWVTaXRlOidsYXgnLCBzZWN1cmU6cHJvY2Vzcy5lbnYuTk9ERV9FTlY9PT0ncHJvZHVjdGlvbicsIHBhdGg6Jy8nLCBtYXhBZ2U6NjAqNjAqMTIgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhclNlc3Npb24oKSB7IGNvb2tpZXMoKS5kZWxldGUoY29va2llTmFtZSk7IH1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFNlc3Npb24oKSB7XG4gIGNvbnN0IHRva2VuID0gY29va2llcygpLmdldChjb29raWVOYW1lKT8udmFsdWU7XG4gIGlmICghdG9rZW4pIHJldHVybiBudWxsO1xuICB0cnkgeyBjb25zdCB7IHBheWxvYWQgfSA9IGF3YWl0IGp3dFZlcmlmeSh0b2tlbiwga2V5KTsgcmV0dXJuIHBheWxvYWQ7IH0gY2F0Y2ggeyByZXR1cm4gbnVsbDsgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0Q3VycmVudFVzZXIoKSB7XG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXNzaW9uKCk7XG4gIGlmICghc2Vzc2lvbj8uaWQpIHJldHVybiBudWxsO1xuICBjb25zdCB1c2VyID0gYXdhaXQgcHJpc21hLnVzZXIuZmluZFVuaXF1ZSh7IHdoZXJlOnsgaWQ6U3RyaW5nKHNlc3Npb24uaWQpIH0sIGluY2x1ZGU6eyBicmFuY2g6dHJ1ZSB9IH0pO1xuICBpZiAoIXVzZXIgfHwgIXVzZXIuYWN0aXZlKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHVzZXI7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXF1aXJlVXNlcigpIHtcbiAgY29uc3QgdXNlciA9IGF3YWl0IGdldEN1cnJlbnRVc2VyKCk7XG4gIGlmICghdXNlcikgdGhyb3cgbmV3IEVycm9yKCdVbmF1dGhvcml6ZWQnKTtcbiAgcmV0dXJuIHVzZXI7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXF1aXJlUGFnZVVzZXIoKSB7XG4gIGNvbnN0IHVzZXIgPSBhd2FpdCBnZXRDdXJyZW50VXNlcigpO1xuICBpZiAoIXVzZXIpIHJlZGlyZWN0KCcvbG9naW4nKTtcbiAgcmV0dXJuIHVzZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYW5BY2Nlc3ModXNlciwgYWxsb3dlZCkgeyByZXR1cm4gYWxsb3dlZC5pbmNsdWRlcyh1c2VyLnJvbGUpOyB9XG5cbmV4cG9ydCBmdW5jdGlvbiBicmFuY2hXaGVyZSh1c2VyLCBmaWVsZD0nYnJhbmNoSWQnKSB7XG4gIGlmICh1c2VyLnJvbGUgPT09ICdTVVBFUl9BRE1JTicgfHwgdXNlci5yb2xlID09PSAnU1VQRVJfVFJBSU5JTkdfQ09PUkRJTkFUT1InKSByZXR1cm4ge307XG4gIHJldHVybiB1c2VyLmJyYW5jaElkID8geyBbZmllbGRdOiB1c2VyLmJyYW5jaElkIH0gOiB7IFtmaWVsZF06ICdfX25vbmVfXycgfTtcbn1cbiJdLCJuYW1lcyI6WyJTaWduSldUIiwiand0VmVyaWZ5IiwiY29va2llcyIsInJlZGlyZWN0IiwiYmNyeXB0IiwicHJpc21hIiwiY29va2llTmFtZSIsImtleSIsIlRleHRFbmNvZGVyIiwiZW5jb2RlIiwicHJvY2VzcyIsImVudiIsIkpXVF9TRUNSRVQiLCJoYXNoUGFzc3dvcmQiLCJwYXNzd29yZCIsImhhc2giLCJ2ZXJpZnlQYXNzd29yZCIsImNvbXBhcmUiLCJjcmVhdGVTZXNzaW9uIiwidXNlciIsInRva2VuIiwiaWQiLCJyb2xlIiwiYnJhbmNoSWQiLCJuYW1lIiwiZW1haWwiLCJzZXRQcm90ZWN0ZWRIZWFkZXIiLCJhbGciLCJzZXRJc3N1ZWRBdCIsInNldEV4cGlyYXRpb25UaW1lIiwic2lnbiIsInNldCIsImh0dHBPbmx5Iiwic2FtZVNpdGUiLCJzZWN1cmUiLCJwYXRoIiwibWF4QWdlIiwiY2xlYXJTZXNzaW9uIiwiZGVsZXRlIiwiZ2V0U2Vzc2lvbiIsImdldCIsInZhbHVlIiwicGF5bG9hZCIsImdldEN1cnJlbnRVc2VyIiwic2Vzc2lvbiIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsIlN0cmluZyIsImluY2x1ZGUiLCJicmFuY2giLCJhY3RpdmUiLCJyZXF1aXJlVXNlciIsIkVycm9yIiwicmVxdWlyZVBhZ2VVc2VyIiwiY2FuQWNjZXNzIiwiYWxsb3dlZCIsImluY2x1ZGVzIiwiYnJhbmNoV2hlcmUiLCJmaWVsZCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth.js\n");

/***/ }),

/***/ "(rsc)/./lib/db.js":
/*!*******************!*\
  !*** ./lib/db.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma || new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nif (true) globalForPrisma.prisma = prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvZGIuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQThDO0FBQzlDLE1BQU1DLGtCQUFrQkM7QUFDakIsTUFBTUMsU0FBU0YsZ0JBQWdCRSxNQUFNLElBQUksSUFBSUgsd0RBQVlBLEdBQUc7QUFDbkUsSUFBSUksSUFBeUIsRUFBY0gsZ0JBQWdCRSxNQUFNLEdBQUdBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGVhLWFwcC8uL2xpYi9kYi5qcz8zZGM5Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gJ0BwcmlzbWEvY2xpZW50JztcbmNvbnN0IGdsb2JhbEZvclByaXNtYSA9IGdsb2JhbFRoaXM7XG5leHBvcnQgY29uc3QgcHJpc21hID0gZ2xvYmFsRm9yUHJpc21hLnByaXNtYSB8fCBuZXcgUHJpc21hQ2xpZW50KCk7XG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgZ2xvYmFsRm9yUHJpc21hLnByaXNtYSA9IHByaXNtYTtcbiJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJnbG9iYWxGb3JQcmlzbWEiLCJnbG9iYWxUaGlzIiwicHJpc21hIiwicHJvY2VzcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/db.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/bcryptjs","vendor-chunks/jose"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.js&appDir=C%3A%5CUsers%5CRotciv%5CDownloads%5CTEA-APP-final-resolved%5Ctea-app%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CRotciv%5CDownloads%5CTEA-APP-final-resolved%5Ctea-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();