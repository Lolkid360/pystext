import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Optional: Change the output directory `out` -> `dist`
  // distDir: 'dist',
  // Optional: Add a basePath if you are deploying to https://<USERNAME>.github.io/<REPO>
  // basePath: '/<REPO>',
};

export default nextConfig;
