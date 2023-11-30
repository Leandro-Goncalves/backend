import { InvalidRefreshTokenError, UnauthorizedUserError } from './auth';
import { CategoryNotFoundError } from './category';
import { ProductNotFoundError } from './product';
import { ExpiredResetTokenError, InvalidResetTokenError } from './resetToken';
import {
  EmailNotRegisteredError,
  UserAlreadyExistsError,
  UserOrEmailNotRegisteredError,
} from './user';

export const Errors = {
  UserAlreadyExists: UserAlreadyExistsError,
  UserOrEmailNotRegistered: UserOrEmailNotRegisteredError,
  InvalidRefreshToken: InvalidRefreshTokenError,
  UnauthorizedUser: UnauthorizedUserError,
  InvalidResetToken: InvalidResetTokenError,
  ExpiredResetToken: ExpiredResetTokenError,
  EmailNotRegistered: EmailNotRegisteredError,
  Products: {
    NotFound: ProductNotFoundError,
  },
  Category: {
    NotFound: CategoryNotFoundError,
  },
};
