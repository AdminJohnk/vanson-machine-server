import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { configSwagger } from '@configs/api-docs.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  configSwagger(app);
  app.useStaticAssets(join(__dirname, './served'));

  // ENV
  const config_service = app.get(ConfigService);

  // NOTICE: GLOBAL MIDDLEWARE
  app.use(helmet());

  // Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const PORT = config_service.get('PORT');
  await app.listen(PORT, () => {
    logger.log(`Server is running on port ${PORT}`);
  });
}
bootstrap();
