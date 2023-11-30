import { UnauthorizedException } from '@nestjs/common';

export const UserAlreadyExistsError = new UnauthorizedException(
  'User already exists',
);

export const UserOrEmailNotRegisteredError = new UnauthorizedException(
  'User and/or email is invalid',
);

export const EmailNotRegisteredError = new UnauthorizedException(
  'Email is invalid',
);
