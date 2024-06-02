import { Module } from '@nestjs/common';
import { StoreCarouselService } from './store-carousel.service';
import { StoreCarouselController } from './store-carousel.controller';
import { ImagesService } from '../images/images.service';
import { S3Service } from '@/services/s3/s3.service';

@Module({
  controllers: [StoreCarouselController],
  providers: [StoreCarouselService, ImagesService, S3Service],
})
export class StoreCarouselModule {}
