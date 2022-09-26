import type * as React from "react";
import { Rect } from "./Rect.js";
import type { Size } from "./Size.js";
import { Animatable, AnimatableObject } from "../../animation/Animatable/Animatable.js";
import type { WithFractionOfFreeSpace } from "../traits/FreeSpace.js";
/** @internal */
export interface DefaultProps {
    parentSize: AnimatableObject<Size>;
}
/**
 * These properties are used to layout elements within Framer’s constraint system.
 * @internalRemarks Represents model property values for layout constraints. These may be internally inconsistent. Mask and Values are generated from these.
 * @public
 * */
export interface ConstraintProperties extends Partial<WithFractionOfFreeSpace> {
    /**
     * //TODO Should it be internal?
     * @internal
     */
    parentSize: Size | null;
    /**
     * Pinned position from left
     * @public
     */
    left: Animatable<number> | number | null;
    /**
     * Pinned position from right
     * @public
     */
    right: Animatable<number> | number | null;
    /**
     * Pinned position from top
     * @public
     */
    top: Animatable<number> | number | null;
    /**
     * Pinned position from bottom
     * @public
     */
    bottom: Animatable<number> | number | null;
    /**
     * Center of horizontal position (X axis)
     * @public
     */
    centerX: ConstraintPercentage;
    /**
     * Center of vertical position (Y axis)
     * @public
     */
    centerY: ConstraintPercentage;
    /**
     * Element width
     * @public
     */
    width: ConstraintDimension;
    /**
     * Element height
     * @public
     */
    height: ConstraintDimension;
    /**
     * Aspect Ratio to keep when resizing
     * @public
     */
    aspectRatio: number | null;
    /**
     * //TODO What is autoSize for? Internal?
     * @public
     */
    autoSize?: boolean;
}
export declare const constraintDefaults: ConstraintProperties;
/** @public */
export declare type ConstraintPercentage = string;
export declare type ConstraintAuto = "auto";
export declare type ConstraintFreespaceFraction = string;
/**
 * Dimensions can be numbers or strings: percentages, fractions of free space (fr), or auto
 * @public
 */
export declare type ConstraintDimension = Animatable<number> | number | ConstraintPercentage | ConstraintAuto | ConstraintFreespaceFraction;
/** @internal */
export declare enum DimensionType {
    FixedNumber = 0,
    Percentage = 1,
    /** @internal */ Auto = 2,
    FractionOfFreeSpace = 3
}
/** @internal */
export declare type SizeConstraints = Partial<{
    minWidth: string | number;
    maxWidth: string | number;
    minHeight: string | number;
    maxHeight: string | number;
}>;
/** @internal */
export interface ConstraintMask extends SizeConstraints {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
    widthType: DimensionType;
    heightType: DimensionType;
    aspectRatio: number | null;
    fixedSize: boolean;
}
export declare function isConstraintSupportingChild<T extends {
    constraints: Partial<ConstraintProperties>;
}>(child: React.ReactChild): child is React.ReactElement<T>;
export declare function isConstraintSupportingClass<T extends ConstraintProperties>(classToTest: any): classToTest is React.ComponentClass<T>;
/** @internal */
export declare namespace ConstraintMask {
    const quickfix: (constraints: ConstraintMask) => ConstraintMask;
}
/** @internal */
export interface ConstraintValuesBase {
    left: number | null;
    right: number | null;
    top: number | null;
    bottom: number | null;
    centerAnchorX: number;
    centerAnchorY: number;
    widthType: DimensionType;
    heightType: DimensionType;
    aspectRatio: number | null;
}
/** @internal */
export interface ConstraintValues extends ConstraintValuesBase, SizeConstraints {
    width: number;
    height: number;
}
/**
 * @internal
 */
export interface UserConstraintValues extends ConstraintValuesBase, SizeConstraints {
    width: number | null;
    height: number | null;
}
/** @internal */
export declare function valueToDimensionType(value: string | number | Animatable<number> | undefined): DimensionType;
/**
 * @internal
 */
export declare namespace ConstraintValues {
    const fromProperties: (props: Partial<ConstraintProperties> & {
        autoSize?: boolean;
    }) => UserConstraintValues;
    const toMinSize: (values: UserConstraintValues, parentSize: Size | null | undefined, autoSize?: Size | null) => Size;
    const toSize: (values: UserConstraintValues, parentSize: Size | null | undefined, autoSize: Size | null, freeSpace: WithFractionOfFreeSpace | null) => Size;
    const toRect: (values: UserConstraintValues, parentSize: Size | AnimatableObject<Size> | null, autoSize?: Size | null, pixelAlign?: boolean, freeSpace?: WithFractionOfFreeSpace | null, viewportSize?: Size | null) => Rect;
}
/** @internal */
export declare function getMergedConstraintsProps(props: any, constraints: Partial<ConstraintProperties>): any;
//# sourceMappingURL=Constraints.d.ts.map