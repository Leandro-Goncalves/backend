import { UnauthorizedException } from '@nestjs/common';

export const UserAlreadyExistsError = new UnauthorizedException(
  'O usuário já existe',
);

export const UserOrEmailNotRegisteredError = new UnauthorizedException(
  'Usuário e/or email invalido',
);

export const EmailNotRegisteredError = new UnauthorizedException(
  'Email invalido',
);
