import { StoreCarousel as IStoreCarousel } from '@prisma/client';
import { IsBoolean, IsInt, IsString, IsUUID } from 'class-validator';

export class StoreCarousel implements Partial<IStoreCarousel> {
  @IsUUID()
  uuid: string;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  title: string;

  @IsInt()
  position: number;
}
