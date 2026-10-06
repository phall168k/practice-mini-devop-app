import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(process.env.API_PREFIX ?? 'api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: process.env.ORIGIN_URL,
    credentials: true,
    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'OPTIONS'
    ],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    exposedHeaders: ['Content-Disposition'],
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });
  await app.listen(process.env.API_PORT ?? 8000);
}
bootstrap();
