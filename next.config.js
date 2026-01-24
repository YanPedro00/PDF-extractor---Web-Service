/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilitar modo standalone para Docker
  output: 'standalone',
  
  experimental: {
    // Incluir better-sqlite3 no standalone
    outputFileTracingIncludes: {
      '/api/**/*': ['./node_modules/better-sqlite3/**/*'],
    },
  },
  
  webpack: (config, { isServer }) => {
    config.resolve.alias.canvas = false;
    
    // Configuração para better-sqlite3
    if (isServer) {
      config.externals.push({
        'better-sqlite3': 'commonjs better-sqlite3'
      });
    }
    
    return config;
  },
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig

