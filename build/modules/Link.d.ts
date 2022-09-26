import * as React from "react";
import { RouterAPI } from "../router/index.js";
interface LinkProps {
    href: string | undefined;
}
declare type LinkAttributes = Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "rel" | "target">;
export declare function propsForLink(href: string): LinkAttributes;
/** @public */
export declare const Link: React.ForwardRefExoticComponent<LinkProps & {
    children?: React.ReactNode;
} & React.RefAttributes<unknown>>;
/** @public */
export declare function resolveLink(href: string, router: Partial<RouterAPI>, implicitPathVariables?: Record<string, unknown>): string | undefined;
export {};
//# sourceMappingURL=Link.d.ts.map