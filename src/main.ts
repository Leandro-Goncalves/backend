import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import fetch from 'cross-fetch';
import { Env } from './config/env';
globalThis.fetch = fetch;

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./src/cert/key.pem'),
    cert: fs.readFileSync('./src/cert/cert.pem'),
  };

  const app = await NestFactory.create(AppModule, {
    cors: { origin: '*' },
    httpsOptions: Env.isDev ? undefined : httpsOptions,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(3332);
}
bootstrap();
