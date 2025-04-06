/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable image domains if you're using external image sources
  images: {
    domains: [],
  },
  // Redirect favicon requests to our API route
  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/api/favicon',
        permanent: true,
      },
    ];
  },
};

export default nextConfig; 