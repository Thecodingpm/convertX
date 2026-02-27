import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Permanent redirect: /tools/pdf-to-word → /pdf-to-word
      // This ensures old links and Google-indexed /tools/* URLs still work
      {
        source: "/tools/:slug",
        destination: "/:slug",
        permanent: true,  // 308 — Google transfers SEO equity to the new URL
      },
    ];
  },
};

export default nextConfig;
