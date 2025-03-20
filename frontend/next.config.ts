/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*', // Proxy to NestJS backend on port 8000
      },
    ];
  },
};

module.exports = nextConfig;
