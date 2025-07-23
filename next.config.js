/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Optimize for Cloudflare Pages
  output: 'standalone',
  experimental: {
    // Reduce bundle size
    optimizeCss: true,
    optimizePackageImports: ['@supabase/supabase-js'],
  },
  // Compress builds
  compress: true,
  // Reduce bundle size
  swcMinify: true,
  // Optimize images
  images: {
    unoptimized: true, // Let Cloudflare handle optimization
  },
}

module.exports = nextConfig 