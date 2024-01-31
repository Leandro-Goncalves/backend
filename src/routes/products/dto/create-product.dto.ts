import { OmitType } from '@nestjs/mapped-types';
import { Product } from '../entities/product.entity';
import { PipeTransform } from '@nestjs/common';

interface Size {
  sizeGuid: string;
  quantity: number;
}

interface Variant {
  name: string;
  price: number;
  promotionalPrice: number;
  sizes: Size[];
  isFavorite?: boolean;
}

export class RequestConverterPipe implements PipeTransform {
  transform(body: any): CreateProductDto {
    const result = new CreateProductDto();
    result.name = body.name;
    result.description = body.description;

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
  variants: Variant[];
}
