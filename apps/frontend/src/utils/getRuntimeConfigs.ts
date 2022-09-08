/* eslint-disable max-len */
import getConfig from 'next/config';

interface PublicRuntimeConfig {
  locales: string;
  nextWebVitalsMetricReport: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ServerRuntimeConfig {}

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();
type PublicRuntimeConfigKeys = keyof PublicRuntimeConfig;
type ServerRuntimeConfigKeys = keyof ServerRuntimeConfig;

export const getPublicRuntimeConfigs = (key: PublicRuntimeConfigKeys): string =>
  publicRuntimeConfig[key];
export const getServerRuntimeConfigs = (key: ServerRuntimeConfigKeys): string =>
  serverRuntimeConfig[key];
