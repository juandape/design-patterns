import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: [
    '@libsql/client',
    'libsql',
    '@neon-rs/load',
    'detect-libc',
  ],
};

export default nextConfig;
