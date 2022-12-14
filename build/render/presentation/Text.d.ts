import * as React from "react";
import { Variants, Transition, MotionStyle, MotionProps } from "framer-motion";
import { Animatable } from "../../animation/Animatable/Animatable.js";
import { FontLoadStatus } from "../fonts/useFontLoadStatus.js";
import type { FilterProperties } from "../traits/Filters.js";
import { NewConstraintProperties, ParentSize } from "../types/NewConstraints.js";
import { RenderTarget } from "../types/RenderEnvironment.js";
import type { Shadow } from "../types/Shadow.js";
import { LayerProps } from "./Layer.js";
/**
 * @internal
 */
export declare type TextAlignment = "left" | "right" | "center" | undefined;
/**
 * @internal
 */
export declare type TextVerticalAlignment = "top" | "center" | "bottom";
/**
 * @internal
 */
export interface TextProps extends NewConstraintProperties, Partial<FilterProperties> {
    rotation: Animatable<number> | number;
    visible: boolean;
    name?: string;
    alignment: TextAlignment;
    verticalAlignment: TextVerticalAlignment;
    /**
     * @deprecated The single autoSize property will only be passed in when the
       supportsDomLayout platform check is NOT on, and will ultimately be
       removed
     */
    autoSize?: boolean;
    opacity?: number;
    shadows: Readonly<Shadow[]>;
    style?: MotionStyle;
    text?: string;
    font?: string;
    parentSize?: ParentSize;
}
/**
 * @internal
 */
export interface TextProperties extends TextProps, LayerProps, Pick<MotionProps, "transformTemplate"> {
    rawHTML?: string;
    isEditable?: boolean;
    fonts?: string[];
    fontLoadStatus: FontLoadStatus;
    layoutId?: string | undefined;
    className?: string;
    /** @internal */
    withExternalLayout?: boolean;
    /** @internal for testing */
    environment?(): RenderTarget;
    /** @internal */
    innerRef?: React.MutableRefObject<HTMLDivElement | null>;
    transition?: Transition;
    variants?: Variants;
    /** @internal */
    __fromCanvasComponent?: boolean;
    /** @internal */
    _initialStyle?: Partial<MotionStyle>;
    /** @internal */
    preload?: string[];
    /** @internal */
    __link?: string;
    /** @internal */
    tabIndex?: number;
}
/**
 * @internal
 */
export declare const Text: React.ForwardRefExoticComponent<Partial<TextProperties> & React.RefAttributes<HTMLDivElement>>;
/**
 * If text is overriden in an override or by a variable, we take the rawHTML,
 * find the first styled span inside the first block, put the text in there, and
 * discard everything else. For example:
 *
 *     <p>
 *         <span>
 *             <span style="BOLD">Hello </span>
 *             <span>World from the 1st block</span>
 *             <br>
 *         </span>
 *         <span>
 *             <!-- Second block is an empty line -->
 *             <span><br></span>
 *         </span>
 *         <span>
 *             <span>More text in third block</span>
 *             <br>
 *         </span>
 *     </p>
 *
 * will become:
 *
 *     <h1>
 *         <span>
 *             <span style="BOLD">Text from the text prop, e.g., a variable or an override</span>
 *             <br>
 *         </span>
 *     </h1>
 */
export declare function replaceDraftHTMLWithText(rawHTML: string, text: string): string;
export declare function findAnchorElementWithin(target: unknown, containerRef: React.RefObject<HTMLDivElement>): HTMLAnchorElement | null;
//# sourceMappingURL=Text.d.ts.map