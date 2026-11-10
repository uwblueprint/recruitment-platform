// Converted from next.config.ts to next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep standalone output rooted at this app, not the parent yarn.lock.
  outputFileTracingRoot: __dirname,
  // Only route files use this suffix; colocated helpers are not pages.
  pageExtensions: ["page.tsx", "page.ts", "page.jsx", "page.js"],
};

module.exports = nextConfig;
