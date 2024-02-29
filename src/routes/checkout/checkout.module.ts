import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { BullModule } from '@nestjs/bull';
import { CreateDeliveryJob } from '@/jobs/createDelivery.job';
import { DiscountCheckoutService } from './discount-checkout/discount-checkout.service';

@Module({
  imports: [BullModule.registerQueue({ name: 'create-delivery-job' })],
  controllers: [CheckoutController],
  providers: [CheckoutService, CreateDeliveryJob, DiscountCheckoutService],
})
export class CheckoutModule {}
