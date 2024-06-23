import { PickType } from '@nestjs/mapped-types';
import { StoreCarousel } from '../entities/store-carousel.entity';

export class UpdateStoreCarouselDto extends PickType(StoreCarousel, [
  'title',
]) {}
