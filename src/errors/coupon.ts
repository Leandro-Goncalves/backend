import { UnauthorizedException } from '@nestjs/common';

export const CouponNotFoundError = new UnauthorizedException(
  'Cupom não encontrado',
);

export const CouponAlreadyExistsError = new UnauthorizedException(
  'Esse código de cupom já está em uso',
);

export const CouponAlreadyUsedError = new UnauthorizedException(
  'Esse cupom foi utilizado',
);

export const CouponIsNotFirstError = new UnauthorizedException(
  'Esse cupom só é valido para primeira compra',
);

export const CouponIsLessThanMinError = new UnauthorizedException(
  'Cupom menor que o mínimo',
);
