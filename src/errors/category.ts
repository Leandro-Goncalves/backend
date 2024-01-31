import { UnauthorizedException } from '@nestjs/common';

export const CategoryNotFoundError = new UnauthorizedException(
  'Category não encontrada',
);
