import appConfig, { type AppConfig } from '@/configs/app.config';
import databaseConfig, { type DatabaseConfig } from '@/configs/database.config';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(
    @Inject(databaseConfig.KEY)
    dbConfig: DatabaseConfig,
    @Inject(appConfig.KEY)
    config: AppConfig,
  ) {
    super({
      datasources: {
        db: {
          url: dbConfig.postgres.url,
        },
      },
      ...(config.isDebugging && {
        log: [
          {
            emit: 'stdout',
            level: 'query',
          },
        ],
      }),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
