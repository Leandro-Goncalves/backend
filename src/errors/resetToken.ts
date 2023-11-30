import { UnauthorizedException } from '@nestjs/common';

export const InvalidResetTokenError = new UnauthorizedException(
  'reset token is invalid',
);

export const ExpiredResetTokenError = new UnauthorizedException(
  'reset token is expired',
);
