import { OmitType } from '@nestjs/mapped-types';
import { Product } from '../entities/product.entity';
import { PipeTransform } from '@nestjs/common';
import { IsArray, IsInt, IsNumber, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class RequestConverterPipe implements PipeTransform {
  transform(body: any): CreateProductDto {
    console.log(body);
    const result = new CreateProductDto();
    result.name = body.name;
    result.description = body.description;
    result.price = body.price;
    result.quantity = +body.quantity;

    console.log(result);

    return result;
  }
}

export class CreateProductDto extends OmitType(Product, [
  'uuid',
  'createdAt',
  'updatedAt',
  'establishmentUuid',
  'isActive',
]) {
  @IsNumber()
  @Transform((params) => +params.value)
  price: number;

  @IsInt()
  @Transform((params) => +params.value)
  quantity: number;

  @IsArray()
  @IsUUID(undefined, { each: true })
  sizes: string[];
}
