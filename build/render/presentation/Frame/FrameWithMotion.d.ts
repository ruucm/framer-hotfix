import * as React from "react";
import type { BackgroundProperties } from "../../traits/Background.js";
import { ConstraintConfiguration, NewConstraintProperties } from "../../types/NewConstraints.js";
import { LayerProps } from "../Layer.js";
import type { BaseFrameProps, CSSTransformProperties, FrameLayoutProperties, MotionDivProps, VisualProperties } from "./types.js";
import { ImageAltProps } from "../../style/BackgroundImageComponent.js";
export declare function unwrapFrameProps(frameProps: Partial<FrameLayoutProperties & ConstraintConfiguration>): Partial<NewConstraintProperties>;
/** @public */
export interface FrameProps extends ImageAltProps, BackgroundProperties, VisualProperties, Omit<MotionDivProps, "color">, CSSTransformProperties, LayerProps, FrameLayoutProperties, ConstraintConfiguration, BaseFrameProps {
    as?: keyof HTMLElementTagNameMap;
    /** @internal */
    __layoutId?: string | undefined;
    /** @internal */
    __fromCanvasComponent?: boolean;
}
export declare const defaultFrameRect: {
    x: number;
    y: number;
    width: number;
    height: number;
};
/** @internal */
export declare const FrameWithMotion: React.ForwardRefExoticComponent<Partial<FrameProps> & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=FrameWithMotion.d.ts.map