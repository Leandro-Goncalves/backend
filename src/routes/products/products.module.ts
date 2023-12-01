import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ImagesService } from '../images/images.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ImagesService],
})
export class ProductsModule {}
