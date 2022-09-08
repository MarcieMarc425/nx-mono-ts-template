import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import os from 'os';

import { DEFAULT_API_VERSION } from '../constants';
import { type Config, configSchema } from '../modules/config/configSchema';
import { getLogLevel } from '../utils';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Config, true>) => ({
        pinoHttp: {
          base: {
            hostname: os.hostname(),
            app: 'template',
            version: DEFAULT_API_VERSION,
          },
          autoLogging: false,
          level: getLogLevel(configService),
          redact: [],
          useLevel: 'trace',
          transport:
            configService.get('NODE_ENV', { infer: true }) !== 'production'
              ? { target: 'pino-pretty', options: { translateTime: true } }
              : undefined,
          quietReqLogger: true,
        },
        renameContext: 'component',
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: (envObject) => configSchema.parse(envObject),
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
