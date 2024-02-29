import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class Items {
  @IsInt()
  quantity: number;

  @IsString()
  productGuid: string;

  @IsString()
  variantGuid: string;

  @IsString()
  sizeGuid: string;
}

export class CreateCheckoutTakeoutDto {
  @IsString()
  @IsOptional()
  couponCode?: string;

  @IsArray()
  @ValidateNested({ each: true })
  items: Items[];
}
