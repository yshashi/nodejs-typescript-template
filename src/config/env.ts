import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('info'),
  LOG_FILE_ENABLED: z
    .string()
    .default('true')
    .transform((val) => val === 'true'),
  LOG_FILE_PATH: z.string().default('logs/app.log'),

  RATE_LIMIT_WINDOW_MS: z.string().default('15000').transform(Number),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100').transform(Number),
});

const parseEnv = (): z.infer<typeof envSchema> => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    process.exit(1);
  }
};

export const env = parseEnv();

export const isProd = (): boolean => env.NODE_ENV === 'production';

export const isDev = (): boolean => env.NODE_ENV === 'development';

export const isTest = (): boolean => env.NODE_ENV === 'test';
