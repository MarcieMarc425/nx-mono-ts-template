import { patchNestjsSwagger } from '@anatine/zod-nestjs';
import { HttpStatus, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { ZodError, ZodIssueCode } from 'zod';

import { AppModule } from './app/app.module';
import { BASE_API_ROUTE, DEFAULT_API_VERSION } from './constants';
import type { Config } from './modules/config/configSchema';
import { getLogLevel } from './utils';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));

  const configService: ConfigService<Config, true> = app.get(ConfigService);

  app.enableVersioning({ type: VersioningType.URI });
  app.setGlobalPrefix(BASE_API_ROUTE, {
    exclude: ['meta/health/readiness', 'meta/health/liveness'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  const allowedOrigin = configService.get('CORS_ORIGIN', { infer: true });
  if (configService.get('NODE_ENV') === 'production' && allowedOrigin === '*') {
    throw new ZodError([
      {
        code: ZodIssueCode.custom,
        message: 'Forbidden value. Expected value to not be `*` in production',
        path: ['CORS_ORIGIN'],
      },
    ]);
  }

  app.enableCors({
    origin: allowedOrigin.split(','),
    credentials: true,
  });

  const logger = app.get(Logger);
  const port = configService.get('PORT', { infer: true }) || 3333;

  if (configService.get('DEPLOY_ENV', { infer: true }) !== 'production') {
    patchNestjsSwagger();
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Server API')
      .setDescription(
        'Backend server APIs - built with NestJS and Typescript in a monolithic architecture\n\n' +
          `NODE_ENV: ${configService.get('NODE_ENV')} - DEPLOY_ENV: ${configService.get(
            'DEPLOY_ENV',
          )} - LOG_LEVEL: ${getLogLevel(configService)}\n\n` +
          `CORS_ORIGIN: ${configService.get('CORS_ORIGIN')}`,
      )
      .setVersion(DEFAULT_API_VERSION)
      .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(`${BASE_API_ROUTE}/docs`, app, swaggerDocument);
    logger.log(`Swagger docs is running on: http://localhost:${port}${BASE_API_ROUTE}/docs`);
  }

  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
