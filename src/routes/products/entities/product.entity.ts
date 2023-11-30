import { Products } from '@prisma/client';
import {
  IsUUID,
  IsString,
  IsNumber,
  IsInt,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class Product implements Partial<Products> {
  @IsUUID()
  uuid: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsString()
  @IsOptional()
  promotionalPrice: number;

  @IsInt()
  quantity: number;

  @IsString()
  establishmentUuid: string;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  createdAt: Date;

  @IsString()
  updatedAt: Date;
}
