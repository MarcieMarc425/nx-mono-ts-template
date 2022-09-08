import { z } from 'zod';

export const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('production'),
  DEPLOY_ENV: z.enum(['local', 'uat', 'production']).default('production'),
  MIN_LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).optional(),
  PORT: z
    .string()
    .transform((str) => parseInt(str, 10))
    .optional(),
  CORS_ORIGIN: z.string().default('*'),
});

export type Config = z.infer<typeof configSchema>;
