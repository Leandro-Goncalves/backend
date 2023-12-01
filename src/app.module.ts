import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './routes/users/users.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { DateService } from './date/date.service';
import { HttpInterceptor } from './AppLoggerMiddleware';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { Env } from './config/env';
import { EstablishmentModule } from './routes/establishment/establishment.module';
import { ProductsModule } from './routes/products/products.module';
import { GlobalModule } from './global/global.module';
import { CategoryModule } from './routes/category/category.module';
import { AuthGuard } from './auth/auth.guard';
import { S3Module } from 'nestjs-s3';
import { ImagesModule } from './routes/images/images.module';
import { CarouselModule } from './routes/carousel/carousel.module';

@Global()
@Module({
  imports: [
    S3Module.forRoot({
      config: {
        credentials: {
          accessKeyId: Env.AlgoliaApplicationID,
          secretAccessKey: Env.CDN_PASSWORD,
        },
        region: Env.CDN_REGION,
        endpoint: Env.CDN_URL,
        forcePathStyle: true,
      },
    }),
    JwtModule.register({
      global: true,
      secret: Env.JWTSecret,
      signOptions: { expiresIn: '1d' },
    }),
    MailerModule.forRoot({
      defaults: {
        from: 'whiteWolf@localhost',
      },
      transport: {
        host: 'localhost',
        secure: false,
        port: 1025,
        ignoreTLS: true,
      },
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    UsersModule,
    EstablishmentModule,
    ProductsModule,
    GlobalModule,
    CategoryModule,
    ImagesModule,
    CarouselModule,
  ],
  controllers: [],
  providers: [
    DateService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [JwtModule, MailerModule, DateService],
})
export class AppModule {}
