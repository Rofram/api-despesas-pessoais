import { EnvironmentError } from '@/common/errors/environment.error';
import { isParseError } from '@/utils/isParseError';
import { ConfigType, registerAs } from '@nestjs/config';
import { z } from 'zod';

const applicationEnvsSchema = z.object({
  BACK_URL: z.string().min(1),
  BACK_PORT: z.coerce.number().min(1),
  API_DOCS_TITLE: z.string().min(1),
  API_DOCS_DESCRIPTION: z.string().min(1),
  API_DOCS_ENDPOINT: z.string().min(1),
});

const appConfig = registerAs('app', () => {
  const envs = applicationEnvsSchema.safeParse(process.env);
  if (isParseError(envs)) throw new EnvironmentError(envs.error);

  return {
    docs: {
      title: envs.data.API_DOCS_TITLE,
      description: envs.data.API_DOCS_DESCRIPTION,
      endpoint: envs.data.API_DOCS_ENDPOINT,
    },
    url: envs.data.BACK_URL,
    port: envs.data.BACK_PORT,
    isDebugging: process.env.NODE_ENV === 'debug',
  } as const;
});

export type AppConfig = ConfigType<typeof appConfig>;

export default appConfig;
