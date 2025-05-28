import appConfig, { AppConfig } from '@/configs/app.config';
import { JWT } from '@/constants';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function swaggerConfig(app: NestExpressApplication) {
  const config = app.get<AppConfig>(appConfig.KEY);
  const docConfig = new DocumentBuilder()
    .setTitle(config.docs.title)
    .setDescription(config.docs.description)
    .setVersion(process.env.npm_package_version)
    .addBearerAuth({ type: 'http' }, JWT.ACCESS_TOKEN)
    .addBearerAuth({ type: 'http' }, JWT.REFRESH_TOKEN)
    .build();
  const document = SwaggerModule.createDocument(app, docConfig);
  SwaggerModule.setup(config.docs.endpoint, app, document);
}
