import { Test, TestingModule } from '@nestjs/testing';
import { DiscountCheckoutService } from './discount-checkout.service';
import { PrismaService } from '@/prisma/prisma.service';
import { CupomType, DiscountType } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { Errors } from '@/errors';

describe('DiscountCheckoutService', () => {
  let service: DiscountCheckoutService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscountCheckoutService, PrismaService],
      imports: [],
    }).compile();

    service = module.get<DiscountCheckoutService>(DiscountCheckoutService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateFirstOrder', () => {
    it('should return true when OrderTakeout or orders in granter than 0', async () => {
      prisma.user.findFirst = jest.fn().mockReturnValueOnce({
        OrderTakeout: [{}],
        orders: [],
      });
      await expect(service.validateFirstOrder('userGuid')).resolves.toBe(true);

      prisma.user.findFirst = jest.fn().mockReturnValueOnce({
        OrderTakeout: [],
        orders: [{}],
      });
      await expect(service.validateFirstOrder('userGuid')).resolves.toBe(true);

      prisma.user.findFirst = jest.fn().mockReturnValueOnce({
        OrderTakeout: [{}],
        orders: [{}],
      });
      await expect(service.validateFirstOrder('userGuid')).resolves.toBe(true);
    });
    it('should return false when OrderTakeout and orders in 0', async () => {
      prisma.user.findFirst = jest.fn().mockReturnValueOnce({
        OrderTakeout: [],
        orders: [],
      });
      await expect(service.validateFirstOrder('userGuid')).resolves.toBe(false);
    });
  });

  describe('validadeUniqueUse', () => {
    it('should return true when Coupon was already used', async () => {
      prisma.user.findFirst = jest.fn().mockReturnValueOnce({
        OrderTakeout: [{ Coupom: { guid: '' } }],
        orders: [],
      });
      await expect(
        service.validadeUniqueUse('userGuid', 'couponGuid'),
      ).resolves.toBe(false);

      prisma.user.findFirst = jest.fn().mockReturnValueOnce({
        OrderTakeout: [{ Coupom: { guid: 'couponGuid' } }],
        orders: [],
      });
      await expect(
        service.validadeUniqueUse('userGuid', 'couponGuid'),
      ).resolves.toBe(true);
    });
  });

  describe('getCouponDiscountValue', () => {
    const defaultReturn = {
      value: 0,
      guid: undefined,
    };

    it('should return default return', async () => {
      await expect(
        service.getCouponDiscountValue('userGuid', 10),
      ).resolves.toMatchObject(defaultReturn);
    });

    it('should return default return when coupon not found', async () => {
      prisma.coupom.findFirst = jest.fn().mockReturnValueOnce(null);

      await expect(
        service.getCouponDiscountValue('userGuid', 10, 'couponCode'),
      ).resolves.toMatchObject(defaultReturn);
    });

    it('should throw error when coupon less than min', async () => {
      const itemsTotal = faker.number.int();
      prisma.coupom.findFirst = jest.fn().mockReturnValueOnce({
        cupomType: CupomType.GENERAL,
        minimumValue: itemsTotal + 1,
      });

      await expect(
        service.getCouponDiscountValue('userGuid', itemsTotal, 'couponCode'),
      ).rejects.toThrow(Errors.Coupon.lessThanMin);
    });

    it('should return max value', async () => {
      const itemsTotal = faker.number.int();
      const discountValue = faker.number.int();
      prisma.coupom.findFirst = jest.fn().mockReturnValueOnce({
        guid: 'couponGuid',
        cupomType: CupomType.GENERAL,
        maxDiscount: discountValue - 1,
        DiscountType: DiscountType.AMOUNT,
        discountValue,
      });

      await expect(
        service.getCouponDiscountValue('userGuid', itemsTotal, 'couponCode'),
      ).resolves.toMatchObject({
        value: discountValue - 1,
        guid: 'couponGuid',
      });

      prisma.coupom.findFirst = jest.fn().mockReturnValueOnce({
        guid: 'couponGuid',
        cupomType: CupomType.GENERAL,
        DiscountType: DiscountType.AMOUNT,
        discountValue,
      });

      await expect(
        service.getCouponDiscountValue('userGuid', itemsTotal, 'couponCode'),
      ).resolves.toMatchObject({
        value: discountValue,
        guid: 'couponGuid',
      });
    });
  });
});
