import { UnauthorizedException } from '@nestjs/common';

export const ProductNotFoundError = new UnauthorizedException(
  'Product not found',
);
