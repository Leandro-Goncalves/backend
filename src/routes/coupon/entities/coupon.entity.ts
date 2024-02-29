import { $Enums, Coupom as ICoupon } from '@prisma/client';
import {
  IsEnum,
  IsString,
  IsUUID,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class Coupon implements Partial<ICoupon> {
  @IsUUID()
  guid?: string;

  @IsString()
  code: string;

  @IsEnum($Enums.CupomType)
  cupomType: $Enums.CupomType;

  @IsEnum($Enums.DiscountType)
  discountType: $Enums.DiscountType;

  @IsNumber()
  discountValue: number;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  @IsOptional()
  finalDate: Date;

  @IsString()
  @IsOptional()
  initialDate: Date;

  @IsNumber()
  @IsOptional()
  maxDiscount: number;

  @IsNumber()
  @IsOptional()
  minimumValue: number;

  @IsNumber()
  quantity: number;

  @IsBoolean()
  @IsOptional()
  isUnlimited: boolean;
}
