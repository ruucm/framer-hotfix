import type { StackSpecificProps, StackAlignment, StackDistribution, StackDirection } from "./types.js";
import * as React from "react";
import { FrameProps } from "../../render/presentation/Frame/FrameWithMotion.js";
import { ParentSize } from "../../render/types/NewConstraints.js";
import type { WillChangeTransformProp } from "../../render/presentation/Layer.js";
/**
 * The Stack component will automatically distribute its contents based on its
 * properties. The Stack component takes the same props as the {@link Frame} component
 * as well as a few additional interface defined below.
 *
 * @remarks
 * ```jsx
 * function MyComponent() {
 *   return (
 *     <Stack>
 *       <Frame />
 *       <Frame />
 *       <Frame />
 *     </Stack>
 *   )
 * }
 * ```
 * @public
 */
export interface StackProperties extends StackSpecificProps, FrameProps, WillChangeTransformProp {
    as?: keyof HTMLElementTagNameMap;
    children?: React.ReactNode;
    /** @internal */
    parentSize?: ParentSize;
    className?: string;
    useFlexboxGap?: boolean;
}
declare type FlexDirection = "column" | "row" | "column-reverse" | "row-reverse";
/**
 * @public
 */
export declare const Stack: React.MemoExoticComponent<React.ForwardRefExoticComponent<Partial<StackProperties> & React.RefAttributes<HTMLElement | HTMLDivElement>>>;
/**
 * @internal
 */
export declare function isFractionDimension(dimension: any): dimension is string;
/**
 * @internal
 */
export declare function fraction(dimension: string): number;
/**
 * @internal
 */
export declare function isGapEnabled(gap: number | undefined, justifyContent: React.CSSProperties["justifyContent"], wrap: boolean): boolean;
/**
 * @internal
 */
export declare function toFlexDirection(direction: StackDirection): FlexDirection;
/** @internal */
export declare function toJustifyOrAlignment(distribution: StackDistribution | StackAlignment): "center" | "space-around" | "space-between" | "space-evenly" | "flex-end" | "flex-start";
export {};
//# sourceMappingURL=Stack.d.ts.map