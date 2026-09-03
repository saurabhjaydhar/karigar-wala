import type { NextConfig } from "next";
import { withSerwist } from "@serwist/turbopack";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Proxy API calls through this app's own origin instead of hitting the
// Railway API domain directly from the browser. Without this, the auth
// cookie is a cross-site (third-party) cookie from Safari/WebKit's
// perspective — iOS blocks that under Intelligent Tracking Prevention even
// with SameSite=None; Secure set correctly, breaking login on every iOS
// browser (all of which use WebKit, not just Safari). Proxying makes the
// request same-origin, which sidesteps ITP, CORS, and SameSite entirely.
const API_PROXY_ORIGIN = process.env.API_PROXY_ORIGIN;

const nextConfig: NextConfig = {
  async rewrites() {
    if (!API_PROXY_ORIGIN) return [];
    return [
      {
        source: "/api/v1/:path*",
        destination: `${API_PROXY_ORIGIN}/api/v1/:path*`,
      },
    ];
  },
};

export default withNextIntl(withSerwist(nextConfig));
