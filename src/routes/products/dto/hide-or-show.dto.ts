import { PickType } from '@nestjs/mapped-types';
import { Product } from '../entities/product.entity';

export class HideOrShowDto extends PickType(Product, ['isActive']) {}
