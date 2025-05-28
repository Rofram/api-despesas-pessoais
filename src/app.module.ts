import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { OpenTelemetryModule } from 'nestjs-otel';
import { appFilters } from './common/filters';
import { appGuards } from './common/guards';
import { appInterceptors } from './common/interceptors';
import appConfig from './configs/app.config';
import databaseConfig from './configs/database.config';
import jwtConfig from './configs/jwt.config';
import { DatabaseModule } from './database/database.module';
import {
  cacheConfigFactory,
  otelConfigFactory,
} from './factories';
import { appModules } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        jwtConfig,
      ],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: cacheConfigFactory,
      inject: [databaseConfig.KEY],
    }),
    JwtModule.register({ global: true }),
    OpenTelemetryModule.forRootAsync({
      useFactory: otelConfigFactory,
    }),
    DatabaseModule,
    ...appModules,
  ],
  providers: [...appInterceptors, ...appFilters, ...appGuards],
})
export class AppModule { }
