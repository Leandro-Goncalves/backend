import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { UseAuth } from '@/auth/roles.decorator';
import { Roles } from '../users/entities/user.entity';
import { UpdateCouponActiveDto } from './dto/update-coupon-active.dto';
import { Errors } from '@/errors';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @UseAuth([Roles.ADMIN])
  @Post()
  async create(@Body() createCouponDto: CreateCouponDto) {
    const coupon = await this.couponService.getCoupon(createCouponDto.code);

    if (coupon) {
      throw Errors.Coupon.AlreadyExists;
    }

    return this.couponService.create(createCouponDto);
  }

  @UseAuth([Roles.ADMIN])
  @Get()
  findAll() {
    return this.couponService.findAll();
  }

  @UseAuth([Roles.ADMIN])
  @Patch(':guid')
  update(
    @Param('guid') guid: string,
    @Body() updateCouponDto: UpdateCouponDto,
  ) {
    return this.couponService.update(guid, updateCouponDto);
  }

  @UseAuth([Roles.ADMIN])
  @Patch(':guid/active')
  updateIsActive(
    @Param('guid') guid: string,
    @Body() updateCouponActiveDto: UpdateCouponActiveDto,
  ) {
    return this.couponService.updateIsActive(
      guid,
      updateCouponActiveDto.isActive,
    );
  }

  @UseAuth([Roles.ADMIN])
  @Delete(':guid')
  remove(@Param('guid') guid: string) {
    return this.couponService.remove(guid);
  }

  @Get(':couponCode')
  async getCoupon(@Param('couponCode') code: string) {
    const coupon = await this.couponService.getCoupon(code);

    if (!coupon) {
      throw Errors.Coupon.NotFound;
    }

    return coupon;
  }
}
