/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilitar modo standalone para Docker
  output: 'standalone',
  
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig

