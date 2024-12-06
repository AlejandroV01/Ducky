/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['nlgbrupftredhrjormbc.supabase.co'], // Add your Supabase storage hostname here
  },
}

export default nextConfig
