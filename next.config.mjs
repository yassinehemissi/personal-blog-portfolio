/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/i2e2/no-robot-i2e2-prez.html',
        destination: '/i2e2/presentation.html',
      },
    ]
  }
}
export default nextConfig
