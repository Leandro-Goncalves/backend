import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class Items {
  @IsInt()
  quantity: number;

  @IsString()
  productGuid: string;

  @IsString()
  variantGuid: string;

  @IsString()
  sizeGuid: string;
}

class Address {
  @IsString()
  cep: string;

  @IsString()
  street: string;

  @IsString()
  neighborhood: string;

  @IsString()
  city: string;

  @IsString()
  number: string;

  @IsString()
  state: string;

  @IsString()
  complement: string;
}

export class CreateCheckoutDto {
  @IsString()
  type: 'pix' | 'boleto' | 'card';

  @ValidateNested()
  to: Address;

  freightId: number;

  @IsString()
  @IsOptional()
  couponCode?: string;

  @IsArray()
  @ValidateNested({ each: true })
  items: Items[];
}
