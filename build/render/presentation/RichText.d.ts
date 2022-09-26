import { MotionProps, MotionStyle } from "framer-motion";
import * as React from "react";
import { Animatable } from "../../animation/Animatable/Animatable.js";
import type { FilterProperties } from "../traits/Filters.js";
import { NewConstraintProperties, ParentSize } from "../types/NewConstraints.js";
import { RenderTarget } from "../types/RenderEnvironment.js";
import type { Shadow } from "../types/Shadow.js";
import type { LayerProps } from "./Layer.js";
import { TextVerticalAlignment } from "./Text.js";
/**
 * @internal
 * Don't change these values as they are used in generated components as well.
 */
export declare const richTextPlaceholder = "{{ text-placeholder }}";
export declare const richTextWrapperClassName = "rich-text-wrapper";
/**
 * @internal
 */
interface RichTextProps extends NewConstraintProperties, Partial<FilterProperties> {
    rotation?: Animatable<number> | number;
    visible?: boolean;
    name?: string;
    verticalAlignment?: TextVerticalAlignment;
    opacity?: number;
    shadows?: readonly Shadow[];
    style?: MotionStyle;
    text?: string;
    html?: string;
    parentSize?: ParentSize;
}
/**
 * @internal
 */
export interface RichTextProperties extends RichTextProps, LayerProps, Pick<MotionProps, "transformTemplate"> {
    htmlFromDesign?: string;
    textFromDesign?: string;
    value?: string;
    isEditable?: boolean;
    fonts?: string[];
    className?: string;
    /** @internal */
    __fromCanvasComponent?: boolean;
    /** @internal Used to replace the text of the html string */
    __htmlStructure?: string;
    /** @internal */
    withExternalLayout?: boolean;
    /** @internal */
    environment?(): RenderTarget;
    /** @internal */
    innerRef?: React.MutableRefObject<HTMLDivElement | null>;
    /** @internal */
    preload?: string[];
    /** @internal */
    __link?: string;
}
/**
 * @internal
 */
export declare const RichText: React.ForwardRefExoticComponent<Partial<RichTextProperties> & React.RefAttributes<HTMLDivElement>>;
export {};
//# sourceMappingURL=RichText.d.ts.map