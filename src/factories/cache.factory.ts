import { DatabaseConfig } from '@/configs/database.config';
import KeyvRedis from '@keyv/redis';

export function cacheConfigFactory(config: DatabaseConfig) {
  return {
    stores: [new KeyvRedis(config.redis.url)],
  };
}
