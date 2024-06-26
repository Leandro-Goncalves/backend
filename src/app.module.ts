import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './routes/users/users.module';
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
import { ImagesModule } from './routes/images/images.module';
import { CarouselModule } from './routes/carousel/carousel.module';
import { CheckoutModule } from './routes/checkout/checkout.module';
import { FreightModule } from './routes/freight/freight.module';
import { MelhorEnvioModule } from './modules/melhor-envio/melhor-envio.module';
import { AssasModule } from './modules/assas/assas.module';
import { S3Service } from './services/s3/s3.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BunnyCDNModule } from '@intelrug/nestjs-bunnycdn';
import { CouponModule } from './routes/coupon/coupon.module';
import { DoubtsModule } from './routes/doubts/doubts.module';
import { FabricsModule } from './routes/fabrics/fabrics.module';
import { BlockModule } from './routes/block/block.module';
import { FeedbacksModule } from './routes/feedbacks/feedbacks.module';
import { StoreCarouselModule } from './routes/store-carousel/store-carousel.module';
import { ReportsModule } from './routes/reports/reports.module';
import { ScheduleModule } from '@nestjs/schedule';

@Global()
@Module({
  imports: [
    ScheduleModule.forRoot(),
    BunnyCDNModule.forRoot({
      apiAccessKey: Env.BunnyNetAccessKey,
      storageZones: [
        {
          name: Env.BunnyNetStorageZoneName,
          accessKey: Env.BunnyNetStorageZonePassword,
        },
      ],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
      renderPath: 'imgs',
    }),
    JwtModule.register({
      global: true,
      secret: Env.JWTSecret,
      signOptions: { expiresIn: '1d' },
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
    CheckoutModule,
    FreightModule,
    AssasModule.register({
      global: true,
      environment: Env.isDev ? 'homologacao' : 'producao',
      token: Env.AssasToken,
    }),
    MelhorEnvioModule.register({
      global: true,
      token: Env.MelhorEnvioToken,
      environment: Env.isDev ? 'homologacao' : 'producao',
    }),
    CouponModule,
    DoubtsModule,
    FabricsModule,
    BlockModule,
    FeedbacksModule,
    StoreCarouselModule,
    ReportsModule,
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
    S3Service,
  ],
  exports: [JwtModule, MelhorEnvioModule, DateService],
})
export class AppModule {}
