import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      { pathname: "/**", search: "" },
      // 캐시버스터: page.tsx의 ASSET_VERSION 값과 동기화해서 유지하세요.
      { pathname: "/**", search: "?v=4" },
      { pathname: "/**", search: "?v=5" },
    ],
  },
};

export default nextConfig;
