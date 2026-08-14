/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      // Images uploaded through the Studio are served from Sanity's CDN.
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" },
    ],
  },
};

module.exports = nextConfig;
