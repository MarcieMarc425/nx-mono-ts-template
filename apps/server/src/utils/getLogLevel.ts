import type { ConfigService } from '@nestjs/config';

import type { Config } from '../modules/config/configSchema';

export const getLogLevel = (configService: ConfigService<Config, true>) => {
  return (
    configService.get('MIN_LOG_LEVEL', { infer: true }) ??
    (configService.get('DEPLOY_ENV', { infer: true }) !== 'production' ? 'info' : 'warn')
  );
};
