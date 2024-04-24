import { Carousel as ICarousel } from '@prisma/client';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class Carousel implements Partial<ICarousel> {
  @IsUUID()
  uuid: string;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  @IsOptional()
  link?: string;

  @IsString()
  name: string;

  @IsInt()
  position: number;
}
