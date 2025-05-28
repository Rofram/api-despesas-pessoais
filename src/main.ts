import { ConsoleLogger, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { otelSDK } from './tracing';
import { handleApiGracefullyShutdown } from './utils/api-gracefully-shutdown';
import { swaggerConfig } from './utils/swaggerConfig';

const isProduction = process.env.NODE_ENV === 'production';

async function bootstrap() {
  // Start SDK before nestjs factory create;
  otelSDK.start();
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    logger: new ConsoleLogger({
      colors: true,
    }),
  });
  const config = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.use(helmet());
  app.useBodyParser('json', { limit: '50mb' });
  app.useBodyParser('urlencoded', { limit: '50mb', extended: true });
  app.enableCors();
  if (!isProduction) {
    swaggerConfig(app);
  }
  await app.listen(config.get('app.port'), '0.0.0.0');
  logger.log(`Application is running on: ${await app.getUrl()}`);
  if (!isProduction) {
    logger.log(`OpenApi Docs is running on: ${await app.getUrl()}${config.get('app.docs.endpoint')}`);
  }
  handleApiGracefullyShutdown(app, otelSDK);
}
bootstrap();
