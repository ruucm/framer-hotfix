import * as React from "react";
import { computeRelativePath, isRoute, useCurrentRoute, getRouteElementId, } from "../router/index.js";
import { isString } from "../utils/utils.js";
// Note: This regular expression should match all other places in our code base.
const pathVariablesRegExp = /:([a-zA-Z][a-zA-Z0-9_]*)/g;
const elementKey = "element";
const collectionKey = "collection";
const collectionItemIdKey = "collectionItemId";
const pathVariablesKey = "pathVariables";
// This includes the comma that separates the media type from the data.
const mediaType = "framer/page-link,";
/**
 * @internal
 */
export function isFramerPageLink(value) {
    return isString(value) && value.startsWith(`data:${mediaType}`);
}
/**
 * @internal
 */
export function createFramerPageLink(targetId = null, options = {}) {
    const target = targetId ? targetId : "none";
    const link = new URL(`data:${mediaType}${target}`);
    if (options.element) {
        link.searchParams.append(elementKey, options.element);
    }
    if (options.collectionItem) {
        link.searchParams.append(collectionKey, options.collectionItem.collection);
        link.searchParams.append(collectionItemIdKey, options.collectionItem.collectionItemId);
        link.searchParams.append(pathVariablesKey, new URLSearchParams(options.collectionItem.pathVariables).toString());
    }
    return link.href;
}
/**
 * @internal
 */
export function parseFramerPageLink(link) {
    if (!isFramerPageLink(link))
        return;
    try {
        const url = new URL(link);
        const target = url.pathname.substring(mediaType.length);
        const attributes = url.searchParams;
        const element = attributes.has(elementKey) ? attributes.get(elementKey) : undefined;
        let collectionItem;
        const collection = attributes.get(collectionKey);
        const collectionItemId = attributes.get(collectionItemIdKey);
        const pathVariablesValue = attributes.get(pathVariablesKey);
        if (collection && collectionItemId && pathVariablesValue) {
            const pathVariables = Object.fromEntries(new URLSearchParams(pathVariablesValue).entries());
            collectionItem = {
                collection,
                collectionItemId,
                pathVariables,
            };
        }
        return {
            target: target === "none" ? null : target,
            element: element === "none" ? null : element,
            collectionItem,
        };
    }
    catch {
        return;
    }
}
/** A regex that searches for html tags, and href values. */
const regex = /(<([a-z]+)(?:\s+(?!href[\s=])[^=\s]+=(?:'[^']*'|"[^"]*"))*)(?:(\s+href\s*=)(?:'([^']*)'|"([^"]*)"))?((?:\s+[^=\s]+=(?:'[^']*'|"[^"]*"))*>)/gi;
/**
 * Escape html characters that would result in invalid paths.
 * https://www.30secondsofcode.org/js/s/escape-html
 */
const escapeHTML = (str) => str.replace(/[&<>'"]/g, tag => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
}[tag] || tag));
/**
 * @internal
 */
export function replaceFramerPageLinks(rawHTML, getRoute, currentRoute, implicitPathVariables) {
    return rawHTML.replace(regex, (original, pre1, tag, pre2, value1, value2, post) => {
        if (tag.toLowerCase() !== "a")
            return original;
        const href = value1 || value2;
        const pageLink = parseFramerPageLink(href.replace(/&amp;/g, "&"));
        if (!pageLink || !pageLink.target)
            return original;
        const targetRoute = getRoute(pageLink.target);
        if (!isRoute(targetRoute) || !isRoute(currentRoute))
            return original;
        const targetPath = targetRoute.path;
        const currentPath = currentRoute.path;
        if (!targetPath || !currentPath)
            return original;
        let attributes = ` ${"data-framer-page-link-target" /* Page */}="${pageLink.target}"`;
        const elementId = getRouteElementId(targetRoute, pageLink.element ?? undefined);
        if (elementId) {
            attributes += ` ${"data-framer-page-link-element" /* Element */}="${pageLink.element}"`;
        }
        if (linkMatchesRoute(currentRoute, pageLink, implicitPathVariables)) {
            attributes += ` ${"data-framer-page-link-current" /* Current */}`;
        }
        let relativePath = targetPath;
        const pathVariables = Object.assign({}, implicitPathVariables, pageLink.collectionItem?.pathVariables);
        if (Object.keys(pathVariables).length > 0) {
            relativePath = relativePath.replace(pathVariablesRegExp, (_, key) => "" + pathVariables[key]);
        }
        if (pageLink.collectionItem?.pathVariables) {
            // Since implicit path variables will be provided when
            // navigating this link, we don't want to use the merged path
            // variables.
            const params = new URLSearchParams(pageLink.collectionItem.pathVariables);
            attributes += ` ${"data-framer-page-link-path-variables" /* PathVariables */}="${params}"`;
        }
        // TODO: For complete correctness, currentPath should also have its path variables filled in.
        relativePath = computeRelativePath(currentPath, relativePath);
        return (pre1 + pre2 + `"${escapeHTML(relativePath + (elementId ? `#${elementId}` : ""))}"` + attributes + post);
    });
}
/** @internal */
export function navigateFromAttributes(navigate, element, implicitPathVariables) {
    // These attributes are set by `replaceFramerPageLinks`.
    let routeId = element.getAttribute("data-framer-page-link-target" /* Page */);
    let elementId;
    let pathVariables;
    if (routeId) {
        elementId = element.getAttribute("data-framer-page-link-element" /* Element */) ?? undefined;
        const pathVariablesRaw = element.getAttribute("data-framer-page-link-path-variables" /* PathVariables */);
        if (pathVariablesRaw) {
            pathVariables = Object.fromEntries(new URLSearchParams(pathVariablesRaw).entries());
        }
    }
    else {
        // Just in case for some reason the link on the element wasn't resolved, try to parse it.
        const href = element.getAttribute("href");
        if (!href)
            return false;
        const link = parseFramerPageLink(href);
        if (!link || !link.target)
            return false;
        routeId = link.target;
        elementId = link.element ?? undefined;
        pathVariables = link.collectionItem?.pathVariables;
    }
    navigate(routeId, elementId, Object.assign({}, implicitPathVariables, pathVariables));
    return true;
}
/** @internal */
export const PathVariablesContext = React.createContext(undefined);
/**
 * @param route The current route to compare against.
 * @param link The link that may point at the current page.
 * @param implicitPathVariables Path variables that will be used by default if
 * not explicitly defined in the link.
 */
function linkMatchesRoute(route, link, implicitPathVariables) {
    if (link.target !== route.id)
        return false;
    // If we allowed page links to be active when they had an element, all page
    // links that were to an element on the current page would always be active.
    // We don't want that, so for now, we ignore links with elements. In future,
    // maybe we can build a feature so that links to an element on the current
    // page are only active when the element is in view.
    if (link.element)
        return false;
    // If there's path variables provided via a context, we should only return
    // true when the context matches the path variable in the current route.
    if (route.path && route.pathVariables) {
        const pathVariables = Object.assign({}, implicitPathVariables, link.collectionItem?.pathVariables);
        for (const [, key] of route.path.matchAll(pathVariablesRegExp)) {
            if (route.pathVariables[key] !== pathVariables[key]) {
                return false;
            }
        }
    }
    return true;
}
/**
 * @internal
 */
export function useLinkMatchesRoute(link) {
    const route = useCurrentRoute();
    const contextPathVariables = React.useContext(PathVariablesContext);
    if (!route)
        return false;
    const pageLink = parseFramerPageLink(link);
    if (!pageLink)
        return false;
    return linkMatchesRoute(route, pageLink, contextPathVariables);
}
/**
 * Implicit path variables (defaults to use for links) are provided???
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
export function useImplicitPathVariables() {
    const contextPathVariables = React.useContext(PathVariablesContext);
    const currentPathVariables = useCurrentRoute()?.pathVariables;
    const pathVariables = contextPathVariables || currentPathVariables;
    return pathVariables;
}
//# sourceMappingURL=framerPageLink.js.map