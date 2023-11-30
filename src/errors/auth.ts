import { UnauthorizedException } from '@nestjs/common';

export const UnauthorizedUserError = new UnauthorizedException(
  'Token is invalid',
);

export const InvalidRefreshTokenError = new UnauthorizedException(
  'Refresh token is invalid',
);
