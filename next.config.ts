import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // 使用 standalone 模式，输出独立可运行的构建产物
  output: 'standalone',

  // Automated Tests 会在部署前执行完整类型检查；避免在低配 k3s 节点重复检查。
  typescript: {
    ignoreBuildErrors: true,
  },

  // 性能优化
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },

  // 图片优化
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.tt829.cn',
        pathname: '/**',
      },
    ],
  },

  // 压缩和优化
  compress: true,
  poweredByHeader: false,

  // 日志配置
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // 头部安全配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/auth/oidc/callback',
        headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
