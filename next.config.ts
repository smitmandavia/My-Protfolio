import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";
const repoName = "My-Protfolio";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  devIndicators: false,
  output: "export",
  basePath: isProduction ? `/${repoName}` : "",
  assetPrefix: isProduction ? `/${repoName}/` : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: isProduction ? `/${repoName}` : "",
  },
};

export default nextConfig;
