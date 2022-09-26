/**
 * @module
 * This module is meant to be used as the entrypoint to import everything `framer` needs from `@framerjs/router`.
 * We need it so we can easily swap private`@framerjs/router` with a stub for Handshake.
 *
 * NOTE: If you re-export some additional API in this file,
 *       please make sure you added a stub version of that API to `./stub.tsx`.
 */
export type { ActiveRoute, Routes, RouteComponent, RouterAPI } from "./stub.js";
export { ComponentWithPreload, computeRelativePath, inferInitialRouteFromPath, isRoute, Route, Router, RouteId, RoutesProvider, RouterAPIProvider, getPathForRoute, getRouteElementId, useCurrentRoute, useCurrentRouteId, useCurrentPathVariables, useRouter, useRouteAnchor, useRouteHandler, useRoutePreloader, preloadComponent, NotFoundError, } from "./stub.js";
//# sourceMappingURL=index.d.ts.map