import { hash } from "../../utils/string.js";
import { isBrowser } from "../../utils/environment.js";
const useDOM = isBrowser();
class SharedSVGEntry {
    id;
    innerHTML;
    viewBox;
    count;
    constructor(id, innerHTML, viewBox, count = 0) {
        this.id = id;
        this.innerHTML = innerHTML;
        this.viewBox = viewBox;
        this.count = count;
    }
}
/** Complex SVGs are placed once in an invisible div and used as a template for all instances.
 * Notice the manager uses the svg string itself as the key to manage global instances with. */
class SharedSVGManager {
    entries = new Map();
    debugGetEntries() {
        return this.entries;
    }
    /** Request to render a svg, this will ensure there is a global instance and will return a
     * template referencing the image. Must be balanced with `unsubscribe()` calls using the same
     * svg. If called multiple times while the shared SVG exists, the generateUniqueIds and
     * contentId parameters are ignored. */
    subscribe(svg, generateUniqueIds, contentId) {
        if (!svg || svg === "")
            return "";
        let entry = this.entries.get(svg);
        if (!entry) {
            // Create a new entry, computing a content id if needed, rewriting ids to be globally
            // unique if needed.
            if (!contentId) {
                contentId = "svg" + String(hash(svg)) + "_" + String(svg.length);
            }
            let uniqueSVG = svg;
            let svgSize;
            const svgDom = parseSVG(svg);
            if (svgDom) {
                if (generateUniqueIds) {
                    uniqueSVG = prefixIdsInSVG(svgDom, contentId);
                }
                svgSize = getSVGSize(svgDom);
            }
            entry = this.createDOMElementFor(uniqueSVG, contentId, svgSize);
            this.entries.set(svg, entry);
        }
        entry.count += 1;
        return entry.innerHTML;
    }
    /** Returns the viewBox for the svg, or undefined if there is no viewBox. */
    getViewBox(svg) {
        if (!svg || svg === "")
            return;
        const entry = this.entries.get(svg);
        return entry?.viewBox;
    }
    /** When no longer rendering an svg it must be unsubscribed from so resources can be cleaned up.
     * Pass in the same svg as used with `subscribe()`. */
    unsubscribe(svg) {
        if (!svg || svg === "")
            return;
        const entry = this.entries.get(svg);
        if (!entry)
            return;
        entry.count -= 1;
        if (entry.count > 0)
            return;
        // When the last use of the svg goes away, after a delay, we see if it should be removed.
        setTimeout(() => this.maybeRemoveEntry(svg), 5000);
    }
    maybeRemoveEntry(svg) {
        const entry = this.entries.get(svg);
        if (!entry)
            return;
        if (entry.count > 0)
            return;
        this.entries.delete(svg);
        this.removeDOMElement(entry);
    }
    removeDOMElement(entry) {
        const containerId = "container_" + entry.id;
        if (useDOM) {
            const container = document?.querySelector("#" + containerId);
            container?.remove();
        }
    }
    createDOMElementFor(svg, id, size) {
        const containerId = "container_" + id;
        if (useDOM) {
            let svgTemplates = document.querySelector("#svg-templates");
            if (!svgTemplates) {
                svgTemplates = document.createElement("div");
                svgTemplates.id = "svg-templates";
                svgTemplates.style.position = "absolute";
                svgTemplates.style.top = "0";
                svgTemplates.style.left = "0";
                svgTemplates.style.width = "0";
                svgTemplates.style.height = "0";
                svgTemplates.style.overflow = "hidden";
                document.body.appendChild(svgTemplates);
            }
            if (!document.querySelector("#" + containerId)) {
                const container = document.createElement("div");
                container.id = containerId;
                container.innerHTML = svg;
                if (container.firstElementChild) {
                    container.firstElementChild.id = id;
                }
                svgTemplates.appendChild(container);
            }
        }
        // An svg referencing a shared template by id. For firefox, if the SVG has a width/height, we use that as our viewBox.
        const box = size ? `0 0 ${size.width} ${size.height}` : undefined;
        const viewBox = box ? ` viewBox="${box}"` : "";
        const innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="width: 100%; height: 100%"${viewBox}><use href="#${id}"></use></svg>`;
        return new SharedSVGEntry(id, innerHTML, box);
    }
}
export const sharedSVGManager = new SharedSVGManager();
// SVG Helper methods
export function parseSVG(svg) {
    if (typeof DOMParser === "undefined")
        return;
    try {
        const domParser = new DOMParser();
        const doc = domParser.parseFromString(svg, "image/svg+xml");
        const node = doc.getElementsByTagName("svg")[0];
        if (!node)
            throw Error("no svg element found");
        return node;
    }
    catch {
        // ignore errors
        return;
    }
}
/* Takes an SVG string and prefix all the ids and their occurrence with the given string */
export function prefixIdsInSVG(svg, prefix) {
    const sanitizedPrefix = sanitizeString(prefix);
    recursivelyPrefixId(svg, sanitizedPrefix);
    return svg.outerHTML;
}
// Valid SVG IDs only include designated characters (letters, digits, and a few punctuation marks),
// and do not start with a digit, a full stop (.) character, or a hyphen-minus (-) character.
// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/id
function sanitizeString(str) {
    return str.replace(/[^a-z0-9\-_:.]|^[^a-z]+/gi, ""); // source: https://stackoverflow.com/a/9635731/9300219
}
function recursivelyPrefixId(el, prefix) {
    // element itself
    prefixId(el, prefix);
    // handle children
    const childNodes = Array.from(el.children);
    childNodes.forEach(node => {
        recursivelyPrefixId(node, prefix);
    });
}
function prefixId(el, prefix) {
    const attributes = el.getAttributeNames();
    attributes.forEach(attr => {
        const value = el.getAttribute(attr);
        if (!value)
            return;
        // prefix the id
        if (attr === "id") {
            el.setAttribute(attr, `${prefix}_${value}`);
        }
        // prefix occurrence in href (SVG2) or xlink:href
        if (attr === "href" || attr === "xlink:href") {
            const [base, fragmentIdentifier] = value.split("#");
            // The value might have a base URL in two cases:
            // 1. It's a hyperlink
            // 2. It's referencing the fragment from another document
            // In both cases we don't want to touch the value
            if (base)
                return;
            el.setAttribute(attr, `#${prefix}_${fragmentIdentifier}`);
            return;
        }
        // prefix occurrence in url()
        const URL_REF = "url(#";
        if (value.includes(URL_REF)) {
            const prefixedValue = value.replace(URL_REF, `${URL_REF}${prefix}_`);
            el.setAttribute(attr, prefixedValue);
        }
    });
}
// Absolute units converted to px according to the CSS3 specification:
// https://www.w3.org/TR/css-values-3/#absolute-lengths
// (1 inch is 2.54 centimeters is 96 pixels)
const unitsToPixels = {
    cm: 96 / 2.54,
    mm: 96 / 2.54 / 10,
    Q: 96 / 2.54 / 40,
    in: 96,
    pc: 96 / 6,
    pt: 96 / 72,
    px: 1,
    // A few assumptions about relative units.
    em: 16,
    ex: 8,
    ch: 8,
    rem: 16,
};
function parseLength(value) {
    if (!value)
        return;
    const m = /([0-9.]+)([a-z]*)/.exec(value);
    if (!m)
        return;
    return Math.round(parseFloat(m[1]) * (unitsToPixels[m[2]] || 1));
}
export function getSVGSize(svg) {
    const width = parseLength(svg.getAttribute("width"));
    const height = parseLength(svg.getAttribute("height"));
    if (typeof width !== "number" || typeof height !== "number")
        return;
    return { width, height };
}
//# sourceMappingURL=SharedSVGManager.js.map