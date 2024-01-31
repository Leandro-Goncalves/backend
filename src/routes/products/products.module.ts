import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ImagesService } from '../images/images.service';
import { S3Service } from '@/services/s3/s3.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ImagesService, S3Service],
})
export class ProductsModule {}
