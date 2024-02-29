import { UnauthorizedException } from '@nestjs/common';

export const ProductNotFoundError = new UnauthorizedException(
  'Product não encontrado',
);

export const InsufficientValueError = new UnauthorizedException(
  'O valor do pedido precisa ser de no mínimo R$ 5,00',
);
