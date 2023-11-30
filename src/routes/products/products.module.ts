import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ImagesService } from '../images/images.service';
import { Env } from '@/config/env';
import { AlgoliaModule } from 'nestjs-algolia';

@Module({
  imports: [
    AlgoliaModule.register({
      applicationId: Env.AlgoliaApplicationID,
      apiKey: Env.AlgoliaKey,
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ImagesService],
})
export class ProductsModule {}
