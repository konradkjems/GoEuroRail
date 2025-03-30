/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-leaflet', 'leaflet'],
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig; 