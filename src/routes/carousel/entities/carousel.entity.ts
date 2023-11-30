import { Carousel as ICarousel } from '@prisma/client';
import { IsUUID } from 'class-validator';

export class Carousel implements Partial<ICarousel> {
  @IsUUID()
  uuid: string;
}
