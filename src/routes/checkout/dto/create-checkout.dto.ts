import { IsArray, IsInt, IsString, ValidateNested } from 'class-validator';

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

  @IsString()
  cpf: string;
}

export class CreateCheckoutDto {
  @ValidateNested()
  to: Address;

  freightId: number;

  @IsArray()
  @ValidateNested({ each: true })
  items: Items[];
}
