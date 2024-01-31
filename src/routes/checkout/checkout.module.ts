import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { BullModule } from '@nestjs/bull';
import { CreateDeliveryJob } from '@/jobs/createDelivery.job';

@Module({
  imports: [BullModule.registerQueue({ name: 'create-delivery-job' })],
  controllers: [CheckoutController],
  providers: [CheckoutService, CreateDeliveryJob],
})
export class CheckoutModule {}
