import { Errors } from '@/errors';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CupomType, DiscountType, OrderStatus } from '@prisma/client';

const defaultReturn = {
  value: 0,
  guid: undefined,
};

@Injectable()
export class DiscountCheckoutService {
  constructor(private prisma: PrismaService) {}

  async validateFirstOrder(userGuid: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        uuid: userGuid,
      },
      select: {
        orders: {
          where: {
            status: {
              not: OrderStatus.cancelled,
            },
          },
        },
        OrderTakeout: {
          where: {
            status: {
              not: OrderStatus.cancelled,
            },
          },
        },
      },
    });

    if (user.OrderTakeout.length > 0 || user.orders.length > 0) {
      return true;
    }
    return false;
  }

  async validadeUniqueUse(userGuid: string, couponGuid: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        uuid: userGuid,
      },
      select: {
        OrderTakeout: {
          select: {
            Coupom: {
              select: {
                guid: true,
              },
            },
          },
          where: {
            status: {
              not: OrderStatus.cancelled,
            },
          },
        },
        orders: {
          select: {
            Coupom: {
              select: {
                guid: true,
              },
            },
          },
          where: {
            status: {
              not: OrderStatus.cancelled,
            },
          },
        },
      },
    });

    if (!user) return false;

    const userCoupon = user.orders.map((o) => o.Coupom?.guid);
    const userTakeoutCoupon = user.OrderTakeout.map((o) => o.Coupom?.guid);
    const couponGuids = [...userCoupon, ...userTakeoutCoupon];

    return couponGuids.includes(couponGuid);
  }

  async getCouponDiscountValue(
    userGuid: string,
    itemsTotal: number,
    code?: string,
  ) {
    if (!code) return defaultReturn;

    const coupon = await this.prisma.coupom.findFirst({
      where: {
        code,
      },
    });

    if (!coupon) return defaultReturn;

    if (
      coupon.cupomType === CupomType.UNIQUE &&
      (await this.validadeUniqueUse(userGuid, coupon.guid))
    ) {
      throw Errors.Coupon.AlreadyUsed;
    }

    if (
      coupon.cupomType === CupomType.FIRST &&
      (await this.validateFirstOrder(userGuid))
    ) {
      throw Errors.Coupon.isNotFirst;
    }

    if (coupon.minimumValue && coupon.minimumValue > itemsTotal) {
      throw Errors.Coupon.lessThanMin;
    }

    let discountValue =
      coupon.discountType === DiscountType.PERCENTAGE
        ? itemsTotal * (coupon.discountValue / 100)
        : coupon.discountValue;

    if (coupon.maxDiscount && discountValue > coupon.maxDiscount) {
      discountValue = coupon.maxDiscount;
    }

    return {
      value: discountValue,
      guid: coupon.guid,
    };
  }
}
