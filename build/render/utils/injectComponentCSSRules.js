import * as CSS from "./setDocumentStyles.js";
import { RenderTarget } from "../../render/types/RenderEnvironment.js";
import { flexboxGapNotSupportedClass } from "../../modules/workaroundFlexboxGapNotSupported.js";
const componentCSSRules = [`[data-framer-component-type] { position: absolute; }`];
// A note about text CSS. Older Framer projects generated text like this:
//
//     <div><!-- wrapper -->
//       <div><!-- first line ("block" in DraftJS parlance) -->
//         <span style="bold">Hello </span><span>world</span><br>
//       </div>
//       <div><!-- second line, etc. --></div>
//     </div>
//
// Newer projects generate text like this:
//
//     <span><!-- wrapper, can pick from span (default), p, h1-h6 -->
//       <span><!-- first line ("block" in DraftJS parlance) -->
//         <span style="bold">Hello </span><span>world</span><br>
//       </span>
//       <span><!-- second line, etc. --></span>
//     </span>
//
// All of this might further be wrapped in an <a>, e.g.:
//
//     <!-- after introducing semantic tags -->
//     <a>
//       <h1><!-- wrapper -->
//         <span><!-- block -->
//           <span style="bold">Hello </span><span>world</span><br>
//         </span>
//       </h1>
//     </a>
//
//     <!-- before introducing semantic tags -->
//     <a><!-- is also the wrapper -->
//       <div><!-- block -->
//         <span style="bold">Hello </span><span>world</span><br>
//       </div>
//     </a>
//
// And the inline spans can also be <a> instead, e.g.:
//
//     <span><!-- wrapper -->
//       <span><!-- block -->
//         <span style="bold">Hello </span><a>world</a><br>
//       </span>
//     </span>
//
// The library CSS needs to support all of that.
const textAlignmentRule = `
[data-framer-component-type="Text"] > * {
    text-align: var(--framer-text-alignment, start);
}`;
const textBlockSpanRule = `
[data-framer-component-type="Text"] span span,
[data-framer-component-type="Text"] p span,
[data-framer-component-type="Text"] h1 span,
[data-framer-component-type="Text"] h2 span,
[data-framer-component-type="Text"] h3 span,
[data-framer-component-type="Text"] h4 span,
[data-framer-component-type="Text"] h5 span,
[data-framer-component-type="Text"] h6 span {
    display: block;
}`;
const textInlineSpanRule = `
[data-framer-component-type="Text"] span span span,
[data-framer-component-type="Text"] p span span,
[data-framer-component-type="Text"] h1 span span,
[data-framer-component-type="Text"] h2 span span,
[data-framer-component-type="Text"] h3 span span,
[data-framer-component-type="Text"] h4 span span,
[data-framer-component-type="Text"] h5 span span,
[data-framer-component-type="Text"] h6 span span {
    display: unset;
}`;
const renderTextStylesRule = `
[data-framer-component-type="Text"] div div span,
[data-framer-component-type="Text"] a div span,
[data-framer-component-type="Text"] span span span,
[data-framer-component-type="Text"] p span span,
[data-framer-component-type="Text"] h1 span span,
[data-framer-component-type="Text"] h2 span span,
[data-framer-component-type="Text"] h3 span span,
[data-framer-component-type="Text"] h4 span span,
[data-framer-component-type="Text"] h5 span span,
[data-framer-component-type="Text"] h6 span span,
[data-framer-component-type="Text"] a {
    font-family: var(--font-family);
    font-style: var(--font-style);
    font-weight: min(calc(var(--framer-font-weight-increase, 0) + var(--font-weight, 400)), 900);
    color: var(--text-color);
    letter-spacing: var(--letter-spacing);
    font-size: var(--font-size);
    text-transform: var(--text-transform);
    text-decoration: var(--text-decoration);
    line-height: var(--line-height);
}`;
const textStylesRule = `
[data-framer-component-type="Text"] div div span,
[data-framer-component-type="Text"] a div span,
[data-framer-component-type="Text"] span span span,
[data-framer-component-type="Text"] p span span,
[data-framer-component-type="Text"] h1 span span,
[data-framer-component-type="Text"] h2 span span,
[data-framer-component-type="Text"] h3 span span,
[data-framer-component-type="Text"] h4 span span,
[data-framer-component-type="Text"] h5 span span,
[data-framer-component-type="Text"] h6 span span,
[data-framer-component-type="Text"] a {
    --font-family: var(--framer-font-family);
    --font-style: var(--framer-font-style);
    --font-weight: var(--framer-font-weight);
    --text-color: var(--framer-text-color);
    --letter-spacing: var(--framer-letter-spacing);
    --font-size: var(--framer-font-size);
    --text-transform: var(--framer-text-transform);
    --text-decoration: var(--framer-text-decoration);
    --line-height: var(--framer-line-height);
}`;
const linkStylesRule = `
[data-framer-component-type="Text"] a,
[data-framer-component-type="Text"] a div span,
[data-framer-component-type="Text"] a span span span,
[data-framer-component-type="Text"] a p span span,
[data-framer-component-type="Text"] a h1 span span,
[data-framer-component-type="Text"] a h2 span span,
[data-framer-component-type="Text"] a h3 span span,
[data-framer-component-type="Text"] a h4 span span,
[data-framer-component-type="Text"] a h5 span span,
[data-framer-component-type="Text"] a h6 span span {
    --font-family: var(--framer-link-font-family, var(--framer-font-family));
    --font-style: var(--framer-link-font-style, var(--framer-font-style));
    --font-weight: var(--framer-link-font-weight, var(--framer-font-weight));
    --text-color: var(--framer-link-text-color, var(--framer-text-color));
    --font-size: var(--framer-link-font-size, var(--framer-font-size));
    --text-transform: var(--framer-link-text-transform, var(--framer-text-transform));
    --text-decoration: var(--framer-link-text-decoration, var(--framer-text-decoration));
}`;
const linkHoverStylesRule = `
[data-framer-component-type="Text"] a:hover,
[data-framer-component-type="Text"] a div span:hover,
[data-framer-component-type="Text"] a span span span:hover,
[data-framer-component-type="Text"] a p span span:hover,
[data-framer-component-type="Text"] a h1 span span:hover,
[data-framer-component-type="Text"] a h2 span span:hover,
[data-framer-component-type="Text"] a h3 span span:hover,
[data-framer-component-type="Text"] a h4 span span:hover,
[data-framer-component-type="Text"] a h5 span span:hover,
[data-framer-component-type="Text"] a h6 span span:hover {
    --font-family: var(--framer-link-hover-font-family, var(--framer-link-font-family, var(--framer-font-family)));
    --font-style: var(--framer-link-hover-font-style, var(--framer-link-font-style, var(--framer-font-style)));
    --font-weight: var(--framer-link-hover-font-weight, var(--framer-link-font-weight, var(--framer-font-weight)));
    --text-color: var(--framer-link-hover-text-color, var(--framer-link-text-color, var(--framer-text-color)));
    --font-size: var(--framer-link-hover-font-size, var(--framer-link-font-size, var(--framer-font-size)));
    --text-transform: var(--framer-link-hover-text-transform, var(--framer-link-text-transform, var(--framer-text-transform)));
    --text-decoration: var(--framer-link-hover-text-decoration, var(--framer-link-text-decoration, var(--framer-text-decoration)));
}`;
const linkCurrentStylesRule = `
[data-framer-component-type="Text"].isCurrent a,
[data-framer-component-type="Text"].isCurrent a div span,
[data-framer-component-type="Text"].isCurrent a span span span,
[data-framer-component-type="Text"].isCurrent a p span span,
[data-framer-component-type="Text"].isCurrent a h1 span span,
[data-framer-component-type="Text"].isCurrent a h2 span span,
[data-framer-component-type="Text"].isCurrent a h3 span span,
[data-framer-component-type="Text"].isCurrent a h4 span span,
[data-framer-component-type="Text"].isCurrent a h5 span span,
[data-framer-component-type="Text"].isCurrent a h6 span span {
    --font-family: var(--framer-link-current-font-family, var(--framer-link-font-family, var(--framer-font-family)));
    --font-style: var(--framer-link-current-font-style, var(--framer-link-font-style, var(--framer-font-style)));
    --font-weight: var(--framer-link-current-font-weight, var(--framer-link-font-weight, var(--framer-font-weight)));
    --text-color: var(--framer-link-current-text-color, var(--framer-link-text-color, var(--framer-text-color)));
    --font-size: var(--framer-link-current-font-size, var(--framer-link-font-size, var(--framer-font-size)));
    --text-transform: var(--framer-link-current-text-transform, var(--framer-link-text-transform, var(--framer-text-transform)));
    --text-decoration: var(--framer-link-current-text-decoration, var(--framer-link-text-decoration, var(--framer-text-decoration)));
}`;
// [data-framer-component-text-autosized] is no longer used, but still supported
// included to maintain backwards compatibility for smart components that were
// generated before it was removed:
// https://github.com/framer/FramerStudio/pull/8270.
const textCSSRules = [
    `[data-framer-component-type="Text"] { cursor: inherit; }`,
    `[data-framer-component-text-autosized] * { white-space: pre; }`,
    textAlignmentRule,
    textBlockSpanRule,
    textInlineSpanRule,
    renderTextStylesRule,
    textStylesRule,
    linkStylesRule,
    linkHoverStylesRule,
    linkCurrentStylesRule,
];
const richTextStylesRule = `
[data-framer-component-type="RichText"] p,
[data-framer-component-type="RichText"] div,
[data-framer-component-type="RichText"] h1,
[data-framer-component-type="RichText"] h2,
[data-framer-component-type="RichText"] h3,
[data-framer-component-type="RichText"] h4,
[data-framer-component-type="RichText"] h5,
[data-framer-component-type="RichText"] h6,
[data-framer-component-type="RichText"] span {
    font-family: var(--framer-font-family, Inter, sans-serif);
    font-style: var(--framer-font-style, normal);
    font-weight: var(--framer-font-weight, 400);
    color: var(--framer-text-color, #000);
    font-size: var(--framer-font-size, 16px);
    letter-spacing: var(--framer-letter-spacing, 0);
    text-transform: var(--framer-text-transform, none);
    text-decoration: var(--framer-text-decoration, none);
    line-height: var(--framer-line-height, 1.2em);
    text-align: var(--framer-text-alignment, start);
}
`;
const richTextParagraphSpacingStylesRule = `
[data-framer-component-type="RichText"] p:not(:first-child),
[data-framer-component-type="RichText"] div:not(:first-child),
[data-framer-component-type="RichText"] h1:not(:first-child),
[data-framer-component-type="RichText"] h2:not(:first-child),
[data-framer-component-type="RichText"] h3:not(:first-child),
[data-framer-component-type="RichText"] h4:not(:first-child),
[data-framer-component-type="RichText"] h5:not(:first-child),
[data-framer-component-type="RichText"] h6:not(:first-child),
[data-framer-component-type="RichText"] img:not(:first-child) {
    margin-top: var(--framer-paragraph-spacing, 0);
}
`;
const richTextBackgroundStylesRule = `
[data-framer-component-type="RichText"] span[data-text-fill] {
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
`;
const richTextLinkStylesRule = `
[data-framer-component-type="RichText"] a,
[data-framer-component-type="RichText"] a span {
    font-family: var(--framer-link-font-family, var(--framer-font-family, Inter, sans-serif));
    font-style: var(--framer-link-font-style, var(--framer-font-style, normal));
    font-weight: var(--framer-link-font-weight, var(--framer-font-weight, 400));
    color: var(--framer-link-text-color, var(--framer-text-color, #000));
    font-size: var(--framer-link-font-size, var(--framer-font-size, 16px));
    text-transform: var(--framer-link-text-transform, var(--framer-text-transform, none));
    text-decoration: var(--framer-link-text-decoration, var(--framer-text-decoration, none));
}
`;
const richTextLinkHoverStylesRule = `
[data-framer-component-type="RichText"] a:hover,
[data-framer-component-type="RichText"] a:hover span {
    font-family: var(--framer-link-hover-font-family, var(--framer-link-font-family, var(--framer-font-family, Inter, sans-serif)));
    font-style: var(--framer-link-hover-font-style, var(--framer-link-font-style, var(--framer-font-style, normal)));
    font-weight: var(--framer-link-hover-font-weight, var(--framer-link-font-weight, var(--framer-font-weight, 400)));
    color: var(--framer-link-hover-text-color, var(--framer-link-text-color, var(--framer-text-color, #000)));
    font-size: var(--framer-link-hover-font-size, var(--framer-link-font-size, var(--framer-font-size, 16px)));
    text-transform: var(--framer-link-hover-text-transform, var(--framer-link-text-transform, var(--framer-text-transform, none)));
    text-decoration: var(--framer-link-hover-text-decoration, var(--framer-link-text-decoration, var(--framer-text-decoration, none)));
}
`;
const richTextLinkCurrentStylesRule = `
a[data-framer-page-link-current],
a[data-framer-page-link-current] span {
    font-family: var(--framer-link-current-font-family, var(--framer-link-font-family, var(--framer-font-family, Inter, sans-serif)));
    font-style: var(--framer-link-current-font-style, var(--framer-link-font-style, var(--framer-font-style, normal)));
    font-weight: var(--framer-link-current-font-weight, var(--framer-link-font-weight, var(--framer-font-weight, 400)));
    color: var(--framer-link-current-text-color, var(--framer-link-text-color, var(--framer-text-color, #000)));
    font-size: var(--framer-link-current-font-size, var(--framer-link-font-size, var(--framer-font-size, 16px)));
    text-transform: var(--framer-link-current-text-transform, var(--framer-link-text-transform, var(--framer-text-transform, none)));
    text-decoration: var(--framer-link-current-text-decoration, var(--framer-link-text-decoration, var(--framer-text-decoration, none)));
}
`;
const richTextLinkCurrentHoverStylesRule = `
a[data-framer-page-link-current]:hover,
a[data-framer-page-link-current]:hover span {
    font-family: var(--framer-link-hover-font-family, var(--framer-link-current-font-family, var(--framer-link-font-family, var(--framer-font-family, Inter, sans-serif))));
    font-style: var(--framer-link-hover-font-style, var(--framer-link-current-font-style, var(--framer-link-font-style, var(--framer-font-style, normal))));
    font-weight: var(--framer-link-hover-font-weight, var(--framer-link-current-font-weight, var(--framer-link-font-weight, var(--framer-font-weight, 400))));
    color: var(--framer-link-hover-text-color, var(--framer-link-current-text-color, var(--framer-link-text-color, var(--framer-text-color, #000))));
    font-size: var(--framer-link-hover-font-size, var(--framer-link-current-font-size, var(--framer-link-font-size, var(--framer-font-size, 16px))));
    text-transform: var(--framer-link-hover-text-transform, var(--framer-link-current-text-transform, var(--framer-link-text-transform, var(--framer-text-transform, none))));
    text-decoration: var(--framer-link-hover-text-decoration, var(--framer-link-current-text-decoration, var(--framer-link-text-decoration, var(--framer-text-decoration, none))));
}
`;
const richTextBoldStylesRule = `
[data-framer-component-type="RichText"] strong {
    font-weight: bolder;
}
`;
const richTextItalicStylesRule = `
[data-framer-component-type="RichText"] em {
    font-style: italic;
}
`;
// Sync with RichTextEditorWithoutStyles.styles.ts
const richTextImageRule = `
[data-framer-component-type="RichText"] .framer-image {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 0 auto;
}
`;
const richTextBlockElementResetRule = `
[data-framer-component-type="RichText"] p,
[data-framer-component-type="RichText"] div,
[data-framer-component-type="RichText"] h1,
[data-framer-component-type="RichText"] h2,
[data-framer-component-type="RichText"] h3,
[data-framer-component-type="RichText"] h4,
[data-framer-component-type="RichText"] h5,
[data-framer-component-type="RichText"] h6 {
    margin: 0;
    padding: 0;
}
`;
const richTextCSSRules = [
    `[data-framer-component-type="RichText"] { cursor: inherit; }`,
    richTextStylesRule,
    richTextParagraphSpacingStylesRule,
    richTextBackgroundStylesRule,
    richTextLinkStylesRule,
    richTextLinkHoverStylesRule,
    richTextLinkCurrentStylesRule,
    richTextLinkCurrentHoverStylesRule,
    richTextBoldStylesRule,
    richTextItalicStylesRule,
    richTextImageRule,
    richTextBlockElementResetRule,
];
/**
 * In generated code sticky is set via CSS, we don't want to set
 * `position: relative` here since it has a higher precedence. Code-gen stack
 * children will receive their `position: relative` through style overrides:
 * https://github.com/framer/FramerStudio/blob/46a401385ffa6a138145451aa56b12588153c4bb/src/app/vekter/src/variants/utils/tagForNode.ts#L338-L340
 */
const stackPositionRule = `
:not([data-framer-generated]) > [data-framer-stack-content-wrapper] > *,
:not([data-framer-generated]) > [data-framer-stack-content-wrapper] > [data-framer-component-type],
:not([data-framer-generated]) > [data-framer-stack-content-wrapper] > [data-framer-stack-gap] > *,
:not([data-framer-generated]) > [data-framer-stack-content-wrapper] > [data-framer-stack-gap] > [data-framer-component-type] {
    position: relative;
}`;
/**
 * Our isFlexboxGapSupported helper relies on DOM measurement, which is not 100%
 * reliable, it could return false while the user agent actually supports gap,
 * for example, if the document is not visible at the time the check runs.
 * Therefore we need to make sure if it determines gap is not supported, we
 * don't use the gap CSS at all, otherwise we end up with double gaps. We could
 * remove the unset rule when we have a proper way to test flexbox gap support.
 * see: https://github.com/framer/company/issues/23712
 * Since the gap variable is available for all stack descendants, we also need
 * to make sure `gap` is used for the ones that's using flexbox gap (has their
 * own --stack-native-gap set), that way nested stacks with different gap
 * settings would work as expected.
 */
const nativeStackGapRules = [
    `[data-framer-stack-content-wrapper][data-framer-stack-gap-enabled="true"] {
        row-gap: var(--stack-native-row-gap);
        column-gap: var(--stack-native-column-gap);
    }`,
    `.${flexboxGapNotSupportedClass} [data-framer-stack-content-wrapper][data-framer-stack-gap-enabled="true"] {
        row-gap: unset;
        column-gap: unset;
    }`,
];
const stackGapRule = `
.${flexboxGapNotSupportedClass} [data-framer-stack-gap] > *, [data-framer-stack-gap][data-framer-stack-flexbox-gap="false"] {
    margin-top: calc(var(--stack-gap-y) / 2);
    margin-bottom: calc(var(--stack-gap-y) / 2);
    margin-right: calc(var(--stack-gap-x) / 2);
    margin-left: calc(var(--stack-gap-x) / 2);
}
`;
/* This should take the language direction into account */
const stackDirectionRuleVertical = `
.${flexboxGapNotSupportedClass}
[data-framer-stack-direction-reverse="false"]
[data-framer-stack-gap]
> *:first-child,
[data-framer-stack-direction-reverse="false"]
[data-framer-stack-gap][data-framer-stack-flexbox-gap="false"]
> *:first-child,
.${flexboxGapNotSupportedClass}
[data-framer-stack-direction-reverse="true"]
[data-framer-stack-gap]
> *:last-child,
[data-framer-stack-direction-reverse="true"]
[data-framer-stack-gap][data-framer-stack-flexbox-gap="false"]
> *:last-child {
    margin-top: 0;
    margin-left: 0;
}`;
/* This should take the language direction into account */
const stackDirectionRuleHorizontal = `
.${flexboxGapNotSupportedClass}
[data-framer-stack-direction-reverse="false"]
[data-framer-stack-gap]
> *:last-child,
[data-framer-stack-direction-reverse="false"]
[data-framer-stack-gap][data-framer-stack-flexbox-gap="false"]
> *:last-child,
.${flexboxGapNotSupportedClass}
[data-framer-stack-direction-reverse="true"]
[data-framer-stack-gap]
> *:first-child,
[data-framer-stack-direction-reverse="true"]
[data-framer-stack-gap][data-framer-stack-flexbox-gap="false"]
> *:first-child {
    margin-right: 0;
    margin-bottom: 0;
}`;
const stackCSSRules = [
    stackPositionRule,
    stackGapRule,
    ...nativeStackGapRules,
    stackDirectionRuleVertical,
    stackDirectionRuleHorizontal,
];
const navigationCSSRules = [
    `
NavigationContainer
[data-framer-component-type="NavigationContainer"] > *,
[data-framer-component-type="NavigationContainer"] > [data-framer-component-type] {
    position: relative;
}`,
];
const scrollCSSRules = [
    `[data-framer-component-type="Scroll"]::-webkit-scrollbar { display: none; }`,
    `[data-framer-component-type="ScrollContentWrapper"] > * { position: relative; }`,
];
const nativeScrollCSSRules = [
    `[data-framer-component-type="NativeScroll"] { -webkit-overflow-scrolling: touch; }`,
    `[data-framer-component-type="NativeScroll"] > * { position: relative; }`,
    `[data-framer-component-type="NativeScroll"].direction-both { overflow-x: scroll; overflow-y: scroll; }`,
    `[data-framer-component-type="NativeScroll"].direction-vertical { overflow-x: hidden; overflow-y: scroll; }`,
    `[data-framer-component-type="NativeScroll"].direction-horizontal { overflow-x: scroll; overflow-y: hidden; }`,
    `[data-framer-component-type="NativeScroll"].direction-vertical > * { width: 100% !important; }`,
    `[data-framer-component-type="NativeScroll"].direction-horizontal > * { height: 100% !important; }`,
    `[data-framer-component-type="NativeScroll"].scrollbar-hidden::-webkit-scrollbar { display: none; }`,
];
const deviceComponentCSSRules = [
    `[data-framer-component-type="DeviceComponent"].no-device > * { width: 100% !important; height: 100% !important; }`,
];
const pageContentWrapperWrapperCSSRules = [
    `[data-framer-component-type="PageContentWrapper"] > *, [data-framer-component-type="PageContentWrapper"] > [data-framer-component-type] { position: relative; }`,
];
const presenceCSS = [
    `[data-is-present="false"], [data-is-present="false"] * { pointer-events: none !important; }`,
];
const cursorCSS = [
    `[data-framer-cursor="pointer"] { cursor: pointer; }`,
    `[data-framer-cursor="grab"] { cursor: grab; }`,
    `[data-framer-cursor="grab"]:active { cursor: grabbing; }`,
];
const frameCSS = [
    `[data-framer-component-type="Frame"] *, [data-framer-component-type="Stack"] * { pointer-events: auto; }`,
    `[data-framer-generated] * { pointer-events: unset }`,
];
const resetCSS = [
    `[data-reset="button"] {
        border-width: 0;
        padding: 0;
}`,
];
/**
 * Add propagation-blocking if we're not on the canvas. If we add this while on the canvas,
 * strange behaviour can appear in the Component panel, with the drag event being blocked.
 */
const frameCSSRules = (isPreview) => {
    return isPreview ? frameCSS : [];
};
const svgCSSRules = [`.svgContainer svg { display: block; }`];
const combineCSSRules = (isPreview) => [
    ...componentCSSRules,
    ...textCSSRules,
    ...richTextCSSRules,
    ...stackCSSRules,
    ...navigationCSSRules,
    ...scrollCSSRules,
    ...nativeScrollCSSRules,
    ...pageContentWrapperWrapperCSSRules,
    ...deviceComponentCSSRules,
    ...presenceCSS,
    ...cursorCSS,
    ...frameCSSRules(isPreview),
    ...svgCSSRules,
    ...resetCSS,
];
// Only generate preview and non preview styles once
/** @internal */
export const combinedCSSRules = combineCSSRules(false);
/** @internal */
export const combinedCSSRulesForPreview = combineCSSRules(true);
/** @internal */
export const injectComponentCSSRules = (sheet, cache) => {
    const styles = RenderTarget.current() === RenderTarget.preview ? combinedCSSRulesForPreview : combinedCSSRules;
    for (const rule of styles)
        CSS.injectCSSRule(rule.trim(), sheet, cache);
};
//# sourceMappingURL=injectComponentCSSRules.js.map