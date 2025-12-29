import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages で画像最適化を動かすための設定
  images: {
    unoptimized: true, 
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'あなたのSupabaseID.supabase.co' },
    ],
  },
};

export default nextConfig;