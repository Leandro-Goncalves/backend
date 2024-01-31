import { IsInt, IsNumber, IsString } from 'class-validator';
export class ProductFormatted {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsInt()
  quantity: number;

  @IsNumber()
  unit_price: number;
}
