import { UnauthorizedException } from '@nestjs/common';

export const UnauthorizedUserError = new UnauthorizedException(
  'Token invalido',
);

export const InvalidRefreshTokenError = new UnauthorizedException(
  'Refresh token invalido',
);
