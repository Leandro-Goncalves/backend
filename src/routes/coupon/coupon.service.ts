import { Injectable } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { DiscountCheckoutService } from '../checkout/discount-checkout/discount-checkout.service';

@Injectable()
export class CouponService {
  constructor(
    private prisma: PrismaService,
    private discountCheckoutService: DiscountCheckoutService,
  ) {}
  create(createCouponDto: CreateCouponDto) {
    return this.prisma.coupom.create({
      data: createCouponDto,
    });
  }

  findAll() {
    return this.prisma.coupom.findMany();
  }

  findOne(guid: string) {
    return this.prisma.coupom.findUnique({ where: { guid } });
  }

  updateIsActive(guid: string, isActive: boolean) {
    return this.prisma.coupom.update({
      where: { guid },
      data: { isActive },
    });
  }

  update(guid: string, updateCouponDto: UpdateCouponDto) {
    return this.prisma.coupom.update({
      where: { guid },
      data: updateCouponDto,
    });
  }

  remove(guid: string) {
    return this.prisma.coupom.delete({ where: { guid } });
  }

  getCoupon(code: string) {
    return this.prisma.coupom.findUnique({
      where: {
        code,
      },
      select: {
        code: true,
        cupomType: true,
        discountValue: true,
        discountType: true,
        minimumValue: true,
        maxDiscount: true,
      },
    });
  }

  getCouponWithFilters(code: string) {
    return this.prisma.coupom.findUnique({
      where: {
        code,
        isActive: true,
        OR: [
          {
            finalDate: { gte: new Date() },
            initialDate: { lte: new Date() },
          },
          {
            finalDate: { equals: null },
            initialDate: { equals: null },
          },
        ],
      },
      select: {
        code: true,
        cupomType: true,
        discountValue: true,
        discountType: true,
        minimumValue: true,
        maxDiscount: true,
      },
    });
  }
}
