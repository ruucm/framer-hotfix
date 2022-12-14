import * as React from "react";
import { motion } from "framer-motion";
import { runtime } from "../../utils/runtimeInjection.js";
import { safeWindow } from "../../utils/safeWindow.js";
import { imageRenderingForZoom, minZoomForPixelatedImageRendering } from "../utils/imageRendering.js";
import { useIsomorphicLayoutEffect } from "../../useIsomorphicLayoutEffect.js";
import { RenderEnvironment, RenderTarget } from "../types/RenderEnvironment.js";
const wrapperStyle = {
    position: "absolute",
    pointerEvents: "none",
    userSelect: "none",
    borderRadius: "inherit",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
};
function cssObjectFit(imageFit) {
    switch (imageFit) {
        case "fit":
            return "contain";
        case "stretch":
            return "fill";
        default:
            return "cover";
    }
}
export function cssImageRendering(image, containerSize) {
    if (!containerSize)
        return "auto";
    // Set appropriate image rendering for the current environment
    const devicePixelRatio = RenderTarget.current() === RenderTarget.canvas ? safeWindow.devicePixelRatio : 1;
    const minPixelatedZoom = minZoomForPixelatedImageRendering(image, containerSize, devicePixelRatio);
    if (RenderTarget.current() === RenderTarget.canvas) {
        // On the canvas we want to always keep image-rendering stable during zoom (hence the zoom = 1) the canvas pixelates the images on zooming in with a css rule
        return imageRenderingForZoom(1, minPixelatedZoom);
    }
    else {
        // In the preview or with export we might require a higer zoom level where images need to get pixelated if their frame is larger then their intrinsic size
        return imageRenderingForZoom(RenderEnvironment.zoom, minPixelatedZoom);
    }
}
function getImageStyle(image, containerSize) {
    return {
        pointerEvents: "none",
        userSelect: "none",
        display: "block",
        width: "100%",
        height: "100%",
        borderRadius: "inherit",
        objectPosition: "center",
        objectFit: cssObjectFit(image.fit),
        imageRendering: cssImageRendering(image, containerSize),
    };
}
const InnerImage = ({ image, containerSize, nodeId, alt }) => {
    const wrapperRef = React.useRef(null);
    // These variables should never change for the lifetime of the component so it's fine to conditionally use hooks
    const isStaticRendering = RenderTarget.current() !== RenderTarget.canvas;
    const source = runtime.useImageSource(image, containerSize, nodeId);
    // srcSet doesn't need resolving via useImageSource, since these are
    // currently only used in generated components, where resolution happens
    // during code-generation.
    const srcSet = image.srcSet;
    const imageStyle = getImageStyle(image, containerSize);
    if (!isStaticRendering) {
        const imageElement = runtime.useImageElement(image, containerSize, nodeId);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useIsomorphicLayoutEffect(() => {
            const wrapper = wrapperRef.current;
            if (wrapper === null)
                return;
            wrapper.appendChild(imageElement);
            return () => {
                wrapper.removeChild(imageElement);
            };
        }, [imageElement]);
        Object.assign(imageElement.style, imageStyle);
    }
    return (React.createElement("div", { ref: wrapperRef, style: { display: "contents", borderRadius: "inherit", pointerEvents: "none" } }, isStaticRendering ? (React.createElement("img", { src: source, alt: alt ?? image.alt, srcSet: srcSet, sizes: image.sizes, style: imageStyle })) : null));
};
export function BackgroundImageComponent({ layoutId, ...rest }) {
    if (layoutId) {
        layoutId = layoutId + "-background";
    }
    return (React.createElement(motion.div, { style: wrapperStyle, layoutId: layoutId, "data-framer-background-image-wrapper": true },
        React.createElement(InnerImage, { ...rest })));
}
//# sourceMappingURL=BackgroundImageComponent.js.map