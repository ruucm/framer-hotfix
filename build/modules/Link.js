import * as React from "react";
import { getPathForRoute, useRouter, inferInitialRouteFromPath, useCurrentRoute, } from "../router/index.js";
import { parseFramerPageLink, useImplicitPathVariables } from "./framerPageLink.js";
import { preloadComponent } from "../router/index.js";
function isInternalURL(href) {
    if (href === undefined)
        return false;
    if (href.startsWith("#") || href.startsWith("/") || href.startsWith("."))
        return true;
    return false;
}
function isValidURL(href, isInternal) {
    try {
        const url = new URL(href);
        return Boolean(url.protocol); // in theory this should always be true, but just in case?
    }
    catch {
        // Ignore thrown errors.
    }
    return isInternal;
}
export function propsForLink(href) {
    const isInternal = isInternalURL(href);
    return {
        href: isValidURL(href, isInternal) ? href : `https://${href}`,
        target: isInternal ? undefined : "_blank",
        rel: !isInternal ? "noreferrer noopener" : undefined,
    };
}
function propsForRoutePath(href, router, currentRoute, implicitPathVariables) {
    const isInternal = isInternalURL(href);
    if (!router.routes || !router.getRoute || !currentRoute || !isInternal)
        return propsForLink(href);
    try {
        const [pathname, hash] = href.split("#", 2);
        const { routeId, pathVariables } = inferInitialRouteFromPath(router.routes, pathname);
        const route = router.getRoute(routeId);
        if (route) {
            preloadComponent(route.page);
            // Hash will be "" if there isn't one. Coerce that
            // to undefined to satisfy the API.
            const elementId = hash || undefined;
            const combinedPathVariables = Object.assign({}, implicitPathVariables, pathVariables);
            // Make the link relative to the current path if we can.
            const path = getPathForRoute(route, {
                currentRoutePath: currentRoute.path,
                elementId,
                pathVariables: combinedPathVariables,
            });
            return {
                href: path,
                onClick(event) {
                    event.preventDefault();
                    router.navigate?.(routeId, elementId, combinedPathVariables);
                },
            };
        }
    }
    catch (e) {
        // Fall through, we could not match the path to a path defined in our
        // routes. We will assume the href is an external link.
    }
    return propsForLink(href);
}
/** @public */
export const Link = React.forwardRef(({ children, href, ...restProps }, forwardedRef) => {
    const router = useRouter();
    const currentRoute = useCurrentRoute();
    const implicitPathVariables = useImplicitPathVariables();
    const props = React.useMemo(() => {
        if (!href)
            return {};
        const pageLink = parseFramerPageLink(href);
        if (!pageLink) {
            return propsForRoutePath(href, router, currentRoute, implicitPathVariables);
        }
        if (!pageLink.target) {
            return {};
        }
        const routeId = pageLink.target;
        const elementId = pageLink.element ?? undefined;
        const route = router.getRoute?.(routeId);
        if (route)
            preloadComponent(route.page);
        const pathVariables = Object.assign({}, implicitPathVariables, pageLink.collectionItem?.pathVariables);
        return {
            href: getPathForRoute(route, {
                currentRoutePath: currentRoute?.path,
                elementId,
                pathVariables,
            }),
            onClick(event) {
                event.preventDefault();
                router.navigate?.(routeId, elementId, pathVariables);
            },
        };
    }, [currentRoute, href, implicitPathVariables, router]);
    if (!children)
        return null;
    const child = React.Children.only(children);
    if (!React.isValidElement(child))
        return null;
    return React.cloneElement(child, { ...restProps, ...props, ref: forwardedRef });
});
/** @public */
export function resolveLink(href, router, implicitPathVariables) {
    // Parsing framer page links means this function is stuck in library.
    const pageLink = parseFramerPageLink(href);
    if (!pageLink || !pageLink.target)
        return propsForLink(href).href;
    if (!router.getRoute || !router.currentRouteId)
        return href;
    const currentRoute = router.getRoute(router.currentRouteId);
    const routeId = pageLink.target;
    const elementId = pageLink.element ?? undefined;
    const route = router.getRoute(routeId);
    const pathVariables = Object.assign({}, implicitPathVariables, pageLink.collectionItem?.pathVariables);
    return getPathForRoute(route, { currentRoutePath: currentRoute?.path, elementId, pathVariables, relative: false });
}
//# sourceMappingURL=Link.js.map