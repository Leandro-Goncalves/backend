import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Request,
  Get,
  Param,
} from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { UseAuth } from '@/auth/roles.decorator';
import { Roles } from '../users/entities/user.entity';
import { AuthReq } from '@/types/authReq';
import { CreateCheckoutTakeoutDto } from './dto/create-checkout-takeout.dto';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  @UseAuth([Roles.USER])
  async create(
    @Request() req: AuthReq,
    @Body() createCheckoutDto: CreateCheckoutDto,
  ) {
    const { id, establishmentUuid } = req.user;
    const url = await this.checkoutService.create(
      id,
      establishmentUuid,
      createCheckoutDto,
    );

    return { url };
  }

  @Get('/orders/all')
  @UseAuth([Roles.ADMIN])
  async ordersAll() {
    return this.checkoutService.getAllOrders();
  }
  @Get('/orders/takeout/all')
  @UseAuth([Roles.ADMIN])
  async ordersTakeoutAll() {
    return this.checkoutService.getAllTakeoutOrders();
  }

  @Post('/takeout')
  @UseAuth([Roles.USER])
  async takeout(
    @Request() req: AuthReq,
    @Body() createCheckoutDto: CreateCheckoutTakeoutDto,
  ) {
    const { id, establishmentUuid } = req.user;
    const url = await this.checkoutService.createTakeout(
      id,
      establishmentUuid,
      createCheckoutDto,
    );

    return { url };
  }

  @Get('/orders/cancel/:orderId')
  @UseAuth([Roles.ADMIN])
  async cancelOrder(@Param('orderId') orderId: string) {
    return this.checkoutService.cancelOrder(orderId);
  }

  @UseAuth([Roles.USER])
  @Get('/orders')
  async listOrders(@Request() req: AuthReq) {
    const { id } = req.user;

    return this.checkoutService.listOrders(id);
  }

  @Get('/orders/finished/:orderId')
  async finishedOrder(@Param('orderId') orderId: string) {
    return this.checkoutService.finishedOrder(orderId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/not')
  async notification(@Body() body: any) {
    if (body?.event !== 'PAYMENT_CONFIRMED') return;
    if (body.payment.installmentNumber !== 1) return;
    this.checkoutService.updatePayment(body.payment.paymentLink);

    return 'OK';
  }
}
