declare module 'next-pwa' {
  import type { NextConfig } from 'next';

  type PWAConfig = {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    skipWaiting?: boolean;
    sw?: string;
    scope?: string;
    cacheOnFrontEndNav?: boolean;
    aggressiveFrontEndNavCaching?: boolean;
    reloadOnOnline?: boolean;
    buildExcludes?: (string | RegExp)[];
    runtimeCaching?: object[];
    workboxOptions?: Record<string, unknown>;
    maximumFileSizeToCacheInBytes?: number;
  };

  function withPWA(config: PWAConfig): (nextConfig: NextConfig) => NextConfig;
  export = withPWA;
}
