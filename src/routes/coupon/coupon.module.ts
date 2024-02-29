import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { DiscountCheckoutService } from '../checkout/discount-checkout/discount-checkout.service';

@Module({
  controllers: [CouponController],
  providers: [CouponService, DiscountCheckoutService],
})
export class CouponModule {}
