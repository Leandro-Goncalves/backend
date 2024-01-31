import { UnauthorizedException } from '@nestjs/common';

export const InvalidResetTokenError = new UnauthorizedException(
  'reset token invalido',
);

export const ExpiredResetTokenError = new UnauthorizedException(
  'reset token expirado',
);
