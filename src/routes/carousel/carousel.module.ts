import { Module } from '@nestjs/common';
import { CarouselService } from './carousel.service';
import { CarouselController } from './carousel.controller';
import { ImagesService } from '../images/images.service';
import { S3Service } from '@/services/s3/s3.service';

@Module({
  controllers: [CarouselController],
  providers: [CarouselService, ImagesService, S3Service],
})
export class CarouselModule {}
