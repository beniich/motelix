import { useState, useEffect } from 'react';

interface ElevationConfig {
  enabled: boolean;
  environment: 'development' | 'staging' | 'production';
  requireReason: boolean;
  cooldownSeconds: number;
}

const DEFAULT_CONFIG: ElevationConfig = {
  enabled: true,
  environment: (import.meta.env.MODE as ElevationConfig['environment']) || 'development',
  requireReason: false,
  cooldownSeconds: 0,
};

export function useElevationControl() {
  const [config, setConfig] = useState<ElevationConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    if (config.environment === 'production') {
      setConfig((prev) => ({ ...prev, enabled: false }));
    }
  }, [config.environment]);

  const isElevationAllowed = (): boolean => {
    if (config.environment === 'production') return false;
    return config.enabled;
  };

  return { config, setConfig, isElevationAllowed };
}
