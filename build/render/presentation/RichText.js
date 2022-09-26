import { useCurrentRoute, useRoutePreloader, useRouter } from "../../router/index.js";
import { motion } from "framer-motion";
import * as React from "react";
import { useRef } from "react";
import { fontStore, LoadFontResult } from "../fonts/fontStore.js";
import { Animatable } from "../../animation/Animatable/Animatable.js";
import { cx } from "../../modules/cx.js";
import { navigateFromAttributes, replaceFramerPageLinks, useImplicitPathVariables, } from "../../modules/framerPageLink.js";
import { useIsOnFramerCanvas } from "../../modules/useIsOnFramerCanvas.js";
import { collectTextShadowsForProps } from "../style/shadow.js";
import { calculateRect, ParentSizeState, useParentSize, } from "../types/NewConstraints.js";
import { RenderTarget } from "../types/RenderEnvironment.js";
import { collectFiltersFromProps } from "../utils/filtersForNode.js";
import { injectComponentCSSRules } from "../utils/injectComponentCSSRules.js";
import { forceLayerBackingWithCSSProperties } from "../utils/setLayerBacked.js";
import { transformTemplate } from "../utils/transformTemplate.js";
import { useLayoutId } from "../utils/useLayoutId.js";
import { measureClosestComponentContainer, useMeasureLayout } from "../utils/useMeasureLayout.js";
import { isShallowEqualArray } from "../utils/isShallowEqualArray.js";
import { ComponentContainerContext } from "./ComponentContainerContext.js";
import { findAnchorElementWithin } from "./Text.js";
/** Used to map characters to HTML entities. */
const htmlEscapes = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
};
/** Used to match HTML entities and HTML characters. */
const reUnescapedHtml = /[&<>"']/g;
const reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
/**
 * Escape function, taken from Lodash
 * @see https://github.com/lodash/lodash/blob/e0029485ab4d97adea0cb34292afb6700309cf16/escape.js#L41
 * */
function escapeHTML(str) {
    return str && reHasUnescapedHtml.test(str) ? str.replace(reUnescapedHtml, chr => htmlEscapes[chr]) : str || "";
}
/**
 * @internal
 * Don't change these values as they are used in generated components as well.
 */
export const richTextPlaceholder = "{{ text-placeholder }}";
export const richTextWrapperClassName = "rich-text-wrapper";
/**
 * @internal
 */
export const RichText = React.forwardRef(function Text(props, forwardedRef) {
    const { id, name, html, htmlFromDesign, text, textFromDesign, fonts = [], width, height, left, right, top, bottom, center, className, visible = true, opacity, rotation = 0, verticalAlignment = "top", isEditable = false, willChangeTransform, environment = RenderTarget.current, withExternalLayout = false, positionSticky, positionStickyTop, positionStickyRight, positionStickyBottom, positionStickyLeft, __htmlStructure, __fromCanvasComponent, _forwardedOverrideId, _forwardedOverrides, _usesDOMRect, ...rest } = props;
    const parentSize = useParentSize();
    const layoutId = useLayoutId(props);
    const fallbackLayoutRef = useRef(null);
    const layoutRef = forwardedRef ?? fallbackLayoutRef;
    const { navigate, getRoute } = useRouter();
    const currentRoute = useCurrentRoute();
    useRoutePreloader(props.preload ?? []);
    useMeasureLayout(props, layoutRef);
    const inCodeComponent = React.useContext(ComponentContainerContext);
    const isOnCanvas = useIsOnFramerCanvas();
    // Replace HTML with text override or variable
    let textOrOverride = text;
    const forwardedOverrideId = _forwardedOverrideId ?? id;
    if (forwardedOverrideId && _forwardedOverrides) {
        const override = _forwardedOverrides[forwardedOverrideId];
        if (typeof override === "string") {
            textOrOverride = override;
        }
    }
    // The __htmlStructure placeholder is inserted in:
    // - collectVariantDefinitionForNode.ts
    // - RichTextNode.getProps
    // - RichTextNode.getAttributes
    let innerHTML = "";
    if (textOrOverride) {
        const escapedText = escapeHTML(textOrOverride);
        innerHTML = __htmlStructure
            ? __htmlStructure.replace(richTextPlaceholder, escapedText)
            : `<p>${escapedText}</p>`;
    }
    else if (html) {
        innerHTML = html;
    }
    else if (textFromDesign) {
        const escapedText = escapeHTML(textFromDesign);
        innerHTML = __htmlStructure
            ? __htmlStructure.replace(richTextPlaceholder, escapedText)
            : `<p>${escapedText}</p>`;
    }
    else if (htmlFromDesign) {
        innerHTML = htmlFromDesign;
    }
    // Parse the ProseMirror HTML to replace framer page links in the `data:framer/page-link,`
    // format with the correct paths their target corresponds to.
    // This needs to happen whenever the HTML string changes, since smart
    // components can update the ProseMirror HTML in variants by updating this prop value.
    const implicitPathVariables = useImplicitPathVariables();
    const innerHTMLWithReplacedFramerPageLinks = React.useMemo(() => {
        if (isOnCanvas || !getRoute || !currentRoute)
            return innerHTML;
        return replaceFramerPageLinks(innerHTML, getRoute, currentRoute, implicitPathVariables);
    }, [isOnCanvas, innerHTML, getRoute, currentRoute, implicitPathVariables]);
    React.useEffect(() => {
        const container = layoutRef.current;
        if (container === null)
            return;
        function interceptPageLinks(event) {
            const anchorElement = findAnchorElementWithin(event.target, layoutRef);
            // Don't prevent cmd + click, allowing users to open in new tab.
            if (event.metaKey || !navigate || !anchorElement)
                return;
            // Page links written to the ProseMirror HTML in the `data:framer/page-link,`
            // format should have been parsed, and replaced with the correct paths.
            // If that has happened, we can access the route id and transition properties
            // as data attributes, finally performing a navigation.
            const didNavigate = navigateFromAttributes(navigate, anchorElement, implicitPathVariables);
            if (didNavigate) {
                event.preventDefault();
            }
        }
        container.addEventListener("click", interceptPageLinks);
        return () => {
            container.removeEventListener("click", interceptPageLinks);
        };
    }, [navigate, implicitPathVariables]);
    // The fonts array is typically regenerated for every change to a text node,
    // so we need to keep track of previous values to avoid calls to the font
    // store when the contents of the array are the same between renders
    const prevFontsRef = useRef([]);
    if (!isShallowEqualArray(prevFontsRef.current, fonts)) {
        prevFontsRef.current = fonts;
        fontStore.loadWebFontsFromSelectors(fonts).then(results => {
            // After fonts load, layout is likely to shift in auto-sized
            // elements. Since measurements would have typically already been
            // taken at this point, this can lead to selection outlines
            // appearing out of sync with the rendered component. On the canvas
            // we hook into the font loading process and manually trigger a
            // re-render for the node when it completes, which in turn makes
            // sure that all layout measurements take the latest layout shifts
            // into account. In compiled smart components, however, we can't use
            // the same solution. We'll instead check if new fonts have been
            // loaded, and attempt to add a measure request for the closest
            // component container, which in the case of component instances is
            // the only node whose measurements need updating (we don't track
            // measurements for things rendered inside the component itself,
            // which could also be affected by layout shifts).
            // If we're not running on the canvas and from within a smart
            // component, there's no need to measure.
            if (!__fromCanvasComponent || !layoutRef.current || RenderTarget.current() !== RenderTarget.canvas)
                return;
            // We only need to measure if at least one new font has been loaded.
            // Otherwise we assume there was no layout shift.
            const didLoadNewFonts = results.some(result => result.status === "fulfilled" && result.value === LoadFontResult.Loaded);
            if (didLoadNewFonts) {
                measureClosestComponentContainer(layoutRef.current);
            }
        });
    }
    // Hooks need to be above this line
    if (!visible)
        return null;
    injectComponentCSSRules();
    const isHidden = isEditable && environment() === RenderTarget.canvas;
    // Add more styling and support vertical text alignment
    const style = {
        outline: "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: convertVerticalAlignment(verticalAlignment),
        opacity: isHidden ? 0 : opacity,
        flexShrink: 0,
    };
    const restrictedRenderTarget = RenderTarget.hasRestrictions();
    const frame = calculateRect(props, parentSize || ParentSizeState.Unknown, false);
    const isAutoSized = _usesDOMRect && (width === "auto" || height === "auto");
    const hasTransformTemplate = !!props.transformTemplate || !frame || !restrictedRenderTarget || __fromCanvasComponent || isAutoSized;
    const template = hasTransformTemplate ? props.transformTemplate ?? transformTemplate(center) : undefined;
    if (!withExternalLayout) {
        if (frame && restrictedRenderTarget && !isAutoSized) {
            const rotate = Animatable.getNumber(rotation).toFixed(4);
            style.transform = `translate(${frame.x}px, ${frame.y}px) rotate(${rotate}deg)`;
            style.width = frame.width;
            style.minWidth = frame.width;
            style.height = frame.height;
        }
        else {
            style.left = left;
            style.right = right;
            style.top = top;
            style.bottom = bottom;
            style.width = width;
            style.height = height;
            // I have no idea why this works as a number but not as a string. This is copied from the Text component.
            style.rotate = rotation;
        }
        if (positionSticky) {
            if (!isOnCanvas || inCodeComponent) {
                style.position = "sticky";
                style.willChange = "transform";
                style.zIndex = 1;
                style.top = positionStickyTop;
                style.right = positionStickyRight;
                style.bottom = positionStickyBottom;
                style.left = positionStickyLeft;
            }
        }
    }
    collectFiltersFromProps(props, style);
    collectTextShadowsForProps(props, style);
    if (willChangeTransform) {
        // We're not using Layer.applyWillChange here, because adding willChange:transform causes clipping issues in export
        forceLayerBackingWithCSSProperties(style);
    }
    Object.assign(style, props.style);

    const renderProps = { id: id, ref: layoutRef, ...rest, style: style, layoutId: layoutId, "data-framer-name": name, "data-framer-component-type": "RichText", "data-center": center, className: cx(className, richTextWrapperClassName), transformTemplate: template };
    if (innerHTMLWithReplacedFramerPageLinks) {
        if (rest.children) renderProps.children = React.createElement('div', { dangerouslySetInnerHTML: { __html: innerHTMLWithReplacedFramerPageLinks } }); // add another tag for rendering html strings (not with current tag & children)
        else renderProps.dangerouslySetInnerHTML = { __html: innerHTMLWithReplacedFramerPageLinks };
    }

    return (React.createElement(motion.div, renderProps));
});
function convertVerticalAlignment(verticalAlignment) {
    switch (verticalAlignment) {
        case "top":
            return "flex-start";
        case "center":
            return "center";
        case "bottom":
            return "flex-end";
    }
}
//# sourceMappingURL=RichText.js.map