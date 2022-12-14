/**
 * This serves as the public entrypoint for the Framer module which is published
 * to npm. Currently it contains all the API's that can be used in Smart
 * Components(SC) and Code Components (CM - Modules not legacy).
 *
 * Looking forward this public entrypoint is focused on catering to users using
 * the handshake feature, that is using SC and CM in the wild.
 *
 * NB: this entrypoint must not be used internally in the framer application.
 *
 * NOTE: if you find that a API is missing from this list please dont hesitate
 * to reach out to us!
 *
 * @module
 */
export * from "framer-motion";
export { addPropertyControls, getPropertyControls } from "./utils/addPropertyControls.js";
export { ControlType } from "./render/types/PropertyControls.js";
export type { ControlDescription, CompactControlsDescription, BooleanControlDescription, BaseControlDescription, NumberControlDescription, StringControlDescription, FusedNumberControlDescription, EnumControlDescription, SegmentedEnumControlDescription, ColorControlDescription, ImageControlDescription, FileControlDescription, ComponentInstanceDescription, EventHandlerControlDescription, TransitionControlDescription, ArrayControlDescription, ArrayItemControlDescription, ObjectControlDescription, ObjectPropertyControlDescription, PropertyControls, } from "./render/types/PropertyControls.js";
export { cx } from "./modules/cx.js";
export { Link } from "./modules/Link.js";
export { useAddVariantProps } from "./modules/useAddVariantProps.js";
export { useActiveVariantCallback } from "./modules/useActiveVariantCallback.js";
export { useOnAppear, useOnVariantChange } from "./modules/useOnVariantChange.js";
export { useGamepad } from "./modules/useGamepad.js";
export { useHotkey } from "./modules/useHotkey.js";
export { useOverlayState } from "./modules/useOverlayState.js";
export { Image } from "./render/presentation/Image.js";
export { useDataRecord } from "./modules/useDataRecord.js";
export { useNavigate } from "./modules/useNavigate.js";
export { useVariantState, CycleVariantState } from "./modules/useVariantState.js";
export { transformTemplate } from "./render/utils/transformTemplate.js";
export { withCSS } from "./modules/withCSS.js";
export { addFonts, getFonts } from "./utils/addFonts.js";
export { Color } from "./render/types/Color/Color.js";
export { Text } from "./render/presentation/Text.js";
export { RichText } from "./render/presentation/RichText.js";
export { SVG } from "./render/presentation/SVG.js";
export { Vector } from "./render/presentation/Vector.js";
export { VectorGroup } from "./render/presentation/VectorGroup.js";
export { Stack } from "./components/Stack/Stack.js";
export { fontStore } from "./render/fonts/fontStore.js";
export { FrameWithMotion } from "./render/presentation/Frame/FrameWithMotion.js";
export { RenderTarget } from "./render/types/RenderEnvironment.js";
export { withMeasuredSize } from "./components/hoc/withMeasuredSize.js";
export { Page } from "./components/Page/EmulatedPage.js";
export { Scroll } from "./components/Scroll/Scroll.js";
export { useIsInCurrentNavigationTarget } from "./components/NavigationContainerContext.js";
export { useRouteHandler, useRouteAnchor } from "./router/index.js";
/**
 * @public
 * @deprecated `Frame` has been deprecated. Please use `motion.div`
 */
export declare function Frame(): void;
//# sourceMappingURL=index.d.ts.map