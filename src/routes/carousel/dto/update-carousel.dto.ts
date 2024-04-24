import { Carousel } from '../entities/carousel.entity';
import { PickType } from '@nestjs/mapped-types';

export class UpdateCarouselDto extends PickType(Carousel, ['name', 'link']) {}
