import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  if (!process.env.JWT_SECRET) {
    logger.warn(
      'JWT_SECRET is not set. Using default secret — DO NOT use in production!',
    );
  }
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
