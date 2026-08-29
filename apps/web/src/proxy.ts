import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip API routes, static files, the PWA service worker/manifest, and Next internals.
  matcher: ["/((?!api|_next|_vercel|serwist|manifest|.*\\..*).*)"],
};
