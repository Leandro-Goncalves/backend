import { PickType } from '@nestjs/mapped-types';
import { Coupon } from '../entities/coupon.entity';

export class CreateCouponDto extends PickType(Coupon, [
  'code',
  'cupomType',
  'discountType',
  'discountValue',
  'finalDate',
  'initialDate',
  'maxDiscount',
  'minimumValue',
  'quantity',
  'isUnlimited',
] as const) {}
