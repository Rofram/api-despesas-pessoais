import { EnvironmentError } from '@/common/errors/environment.error';
import { isParseError } from '@/utils/isParseError';
import { ConfigType, registerAs } from '@nestjs/config';
import { z } from 'zod';

const databaseEnvsSchema = z.object({
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().min(1),
  DB_DATABASE: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  REDIS_HOST: z.string().min(1),
  REDIS_PORT: z.coerce.number().min(1),
  REDIS_URL: z.string().min(1),
});

const databaseConfig = registerAs('database', () => {
  const envs = databaseEnvsSchema.safeParse(process.env);
  if (isParseError(envs)) throw new EnvironmentError(envs.error);

  return {
    postgres: {
      host: envs.data.DB_HOST,
      port: envs.data.DB_PORT,
      user: envs.data.DB_USER,
      password: envs.data.DB_PASSWORD,
      database: envs.data.DB_DATABASE,
      url: envs.data.DATABASE_URL,
    },
    redis: {
      url: envs.data.REDIS_URL,
      host: envs.data.REDIS_HOST,
      port: envs.data.REDIS_PORT,
    },
  } as const;
});

export type DatabaseConfig = ConfigType<typeof databaseConfig>;

export default databaseConfig;
