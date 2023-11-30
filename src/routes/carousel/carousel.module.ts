import { Module } from '@nestjs/common';
import { CarouselService } from './carousel.service';
import { CarouselController } from './carousel.controller';
import { ImagesService } from '../images/images.service';

@Module({
  controllers: [CarouselController],
  providers: [CarouselService, ImagesService],
})
export class CarouselModule {}
