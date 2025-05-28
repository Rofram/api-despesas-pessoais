import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NodeSDK } from '@opentelemetry/sdk-node';

export function handleApiGracefullyShutdown(
  app: NestExpressApplication,
  otel: NodeSDK,
) {
  const logger = new Logger('ApiGracefullyShutdown');
  const shutdownApiAndOtel = async () => {
    await app.close();
    await otel.shutdown();
    process.exit(0);
  };

  process.on('SIGINT', async () => {
    logger.verbose('Received SIGINT. Gracefully shutting down...');
    await shutdownApiAndOtel();
  });
  process.on('SIGTERM', async () => {
    logger.verbose('Received SIGTERM. Gracefully shutting down...');
    await shutdownApiAndOtel();
  });
}
