/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
  },
  eslint: {
    dirs: ['src'],
  },
}

module.exports = nextConfig 