import * as React from "react";
import type { Size } from "./Size.js";
import type { Rect } from "./Rect.js";
import { UserConstraintValues, DimensionType, SizeConstraints } from "./Constraints.js";
export interface PositionProperties {
    top: number | string;
    right: number | string;
    bottom: number | string;
    left: number | string;
    center: "x" | "y" | boolean;
}
export interface SizeProperties extends SizeConstraints {
    width: number | string;
    height: number | string;
    size: number | string;
}
/** @public */
export interface PositionStickyProperties {
    /** @internal */
    positionSticky?: boolean;
    /** @internal */
    positionStickyTop?: number;
    /** @internal */
    positionStickyRight?: number;
    /** @internal */
    positionStickyBottom?: number;
    /** @internal */
    positionStickyLeft?: number;
}
export interface PositionFixedProperties {
    /** @internal */
    positionFixed?: boolean;
}
export interface LayoutProperties extends PositionProperties, PositionStickyProperties, PositionFixedProperties, SizeProperties {
    /** @internal */
    widthType?: DimensionType;
    /** @internal */
    heightType?: DimensionType;
}
export interface CustomConstraintProperties {
    /**
     * Aspect Ratio to keep when resizing
     * @public
     */
    aspectRatio?: number | null;
    /**
     * Used for Text and Graphics containers
     * @public
     */
    autoSize?: boolean;
    /**
     * Use Vekter constraint layout system, disable DOM layout
     * @public
     */
    enabled: boolean;
    intrinsicWidth?: number;
    intrinsicHeight?: number;
}
export interface ConstraintConfiguration {
    /** @internal */
    _constraints: CustomConstraintProperties;
}
/** @internal */
export interface NewConstraintProperties extends Partial<LayoutProperties>, ConstraintConfiguration {
}
/** @internal */
export declare function constraintsEnabled(props: Partial<NewConstraintProperties>): props is NewConstraintProperties;
export declare function calculateSize(props: Partial<NewConstraintProperties & Partial<{
    size: number | string;
}>>, parentSize: ParentSize): Size | null;
/** @internal */
export declare function calculateRect(props: Partial<NewConstraintProperties & Partial<{
    size: number | string;
}>>, parentSize: ParentSize, pixelAlign?: boolean, viewportSize?: Size | null): Rect | null;
/** @internal */
export declare function getConstraintValues(props: NewConstraintProperties): UserConstraintValues;
/** @internal */
export declare enum ParentSizeState {
    Unknown = 0,
    Disabled = 1,
    DisabledForCurrentLevel = 2
}
/** @internal */
export declare type ParentSize = Size | ParentSizeState;
export declare const ConstraintsContext: React.Context<{
    parentSize: ParentSize;
    viewportSize: Size | null;
}>;
export declare function deprecatedParentSize(parentSize: ParentSize): Size | null;
/** @internal */
export declare function useParentSize(): ParentSize;
/** @internal */
export declare function useViewportSize(): Size | null;
export declare function isSize(o: ParentSize): o is Size;
/** @internal */
export declare const ProvideParentAndViewportSize: React.FunctionComponent<{
    parentSize: ParentSize;
    viewportSize: Size | null;
}>;
export declare const ConsumeParentSize: React.Consumer<{
    parentSize: ParentSize;
    viewportSize: Size | null;
}>;
export declare function useProvideParentSizeAndViewportSize(node: React.ReactNode, parentSize: ParentSize, viewportSize: Size | null): React.ReactNode;
export declare function useConstraints(props: Partial<NewConstraintProperties>): Rect | null;
//# sourceMappingURL=NewConstraints.d.ts.map