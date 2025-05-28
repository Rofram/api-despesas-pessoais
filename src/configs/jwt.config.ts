import { EnvironmentError } from '@/common/errors/environment.error';
import { isParseError } from '@/utils/isParseError';
import { ConfigType, registerAs } from '@nestjs/config';
import { z } from 'zod';

const jwtEnvsSchema = z.object({
  ACCESS_TOKEN_SECRET: z.string().min(1),
  ACCESS_TOKEN_EXPIRATION: z.string().min(1),
  REFRESH_TOKEN_SECRET: z.string().min(1),
  REFRESH_TOKEN_EXPIRATION: z.string().min(1),
});

const jwtConfig = registerAs('jwt', () => {
  const envs = jwtEnvsSchema.safeParse(process.env);
  if (isParseError(envs)) throw new EnvironmentError(envs.error);

  return {
    accessToken: {
      secret: envs.data.ACCESS_TOKEN_SECRET,
      expiration: envs.data.ACCESS_TOKEN_EXPIRATION,
    },
    refreshToken: {
      secret: envs.data.REFRESH_TOKEN_SECRET,
      expiration: envs.data.REFRESH_TOKEN_EXPIRATION,
    },
  } as const;
});

export type JwtConfig = ConfigType<typeof jwtConfig>;

export default jwtConfig;
