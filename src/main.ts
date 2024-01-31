import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import fetch from 'cross-fetch';
globalThis.fetch = fetch;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: '*' },
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(3333);
}
bootstrap();
