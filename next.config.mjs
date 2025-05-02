/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-leaflet', 'leaflet'],
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
    optimizeCss: true,
    optimizePackageImports: ['@heroicons/react'],
  },
  webpack: (config, { isServer }) => {
    config.optimization.splitChunks = {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        mapComponents: {
          test: /[\\/]components[\\/](InterrailMap|MobileMap|AccommodationMap)/,
          name: 'map-components',
          chunks: 'all',
          priority: 10,
        },
        itineraryComponents: {
          test: /[\\/]components[\\/](TripItinerary|AccommodationScreen|TrainSchedule)/,
          name: 'itinerary-components',
          chunks: 'all',
          priority: 10,
        },
      },
    };
    
    return config;
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          // Security headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        // Allow CSV files to be fetched properly
        source: '/data/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/csv',
          },
        ],
      },
    ];
  },
  env: {
    NODE_TLS_REJECT_UNAUTHORIZED: '0',
  },
};

export default nextConfig; 