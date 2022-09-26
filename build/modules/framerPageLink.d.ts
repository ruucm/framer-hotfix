import * as React from "react";
import { ActiveRoute, Route, RouteId, RouterAPI } from "../router/index.js";
/**
 * @internal
 */
export interface FramerPageLinkCollectionItemAttribute {
    collection: string;
    collectionItemId: string;
    pathVariables: Record<string, string>;
}
/**
 * @internal
 */
export interface FramerPageLinkAttributes {
    element?: string | null;
    collectionItem?: FramerPageLinkCollectionItemAttribute;
}
/**
 * @internal
 */
export declare function isFramerPageLink(value: unknown): value is string;
/**
 * @internal
 */
export declare function createFramerPageLink(targetId?: string | null, options?: FramerPageLinkAttributes): string;
/**
 * @internal
 */
export interface PageLinkParsedResult {
    target: string | null;
    element: string | null | undefined;
    collectionItem: FramerPageLinkCollectionItemAttribute | undefined;
}
/**
 * @internal
 */
export declare function parseFramerPageLink(link: unknown): PageLinkParsedResult | undefined;
/**
 * @internal
 */
export declare const enum PageLinkAttribute {
    Page = "data-framer-page-link-target",
    Element = "data-framer-page-link-element",
    PathVariables = "data-framer-page-link-path-variables",
    Current = "data-framer-page-link-current"
}
/**
 * @internal
 */
export declare function replaceFramerPageLinks(rawHTML: string, getRoute: (routeId: RouteId) => Route | undefined, currentRoute: ActiveRoute, implicitPathVariables?: Record<string, unknown>): string;
/** @internal */
export declare function navigateFromAttributes(navigate: RouterAPI["navigate"], element: HTMLAnchorElement, implicitPathVariables?: Record<string, unknown>): boolean;
/** @internal */
export declare const PathVariablesContext: React.Context<Record<string, unknown> | undefined>;
/**
 * @internal
 */
export declare function useLinkMatchesRoute(link: unknown): boolean;
/**
 * Implicit path variables (defaults to use for links) are provided…
 *
 * - via the PathVariablesContext, for use with repeaters
 *
 *   e.g. a link to /blog/:slug, repeated multiple times with different :slug
 *   variables
 *
 * - via the current dynamic page
 *
 *   e.g. a page links to itself (permalink? scroll target?)
 *
 * XXX: You never know which route these path variables are intended for, so
 * it's possible to have a mismatch. Should this hook accept a route ID?
 *
 * @internal
 */
export declare function useImplicitPathVariables(): Record<string, unknown> | undefined;
//# sourceMappingURL=framerPageLink.d.ts.map