import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import fetch from 'cross-fetch';
globalThis.fetch = fetch;

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./src/cert/key.pem'),
    cert: fs.readFileSync('./src/cert/cert.pem'),
  };

  const app = await NestFactory.create(AppModule, {
    cors: { origin: '*' },
    httpsOptions,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(3333);
}
bootstrap();
