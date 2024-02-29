import { PickType } from '@nestjs/mapped-types';
import { Coupon } from '../entities/coupon.entity';

export class UpdateCouponActiveDto extends PickType(Coupon, ['isActive']) {}
