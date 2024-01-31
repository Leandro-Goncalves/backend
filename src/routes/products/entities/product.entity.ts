import { Products } from '@prisma/client';
import { IsUUID, IsString, IsBoolean } from 'class-validator';

export class Product implements Partial<Products> {
  @IsUUID()
  uuid: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  establishmentUuid: string;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  createdAt: Date;

  @IsString()
  updatedAt: Date;
}
