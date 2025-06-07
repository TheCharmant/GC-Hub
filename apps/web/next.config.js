/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['api'],
  experimental: {
    externalDir: true,
  },
  typescript: {
    // This tells Next.js to use the tsconfig.json in the current directory
    // and not try to resolve the extends path itself
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json',
  },
};

export default nextConfig;
