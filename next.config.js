/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  images: {
    domains: ["imagedelivery.net"],
  },
};

module.exports = nextConfig;
