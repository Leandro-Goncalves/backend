import { InvalidRefreshTokenError, UnauthorizedUserError } from './auth';
import { CategoryNotFoundError } from './category';
import {
  CouponAlreadyExistsError,
  CouponAlreadyUsedError,
  CouponIsLessThanMinError,
  CouponIsNotFirstError,
  CouponNotFoundError,
} from './coupon';
import { InsufficientValueError, ProductNotFoundError } from './product';
import { ExpiredResetTokenError, InvalidResetTokenError } from './resetToken';
import {
  CPFAlreadyRegisteredError,
  EmailNotRegisteredError,
  UserAlreadyExistsError,
  UserOrEmailNotRegisteredError,
} from './user';

export const Errors = {
  UserAlreadyExists: UserAlreadyExistsError,
  User: {
    CPFAlreadyRegistered: CPFAlreadyRegisteredError,
  },
  UserOrEmailNotRegistered: UserOrEmailNotRegisteredError,
  InvalidRefreshToken: InvalidRefreshTokenError,
  UnauthorizedUser: UnauthorizedUserError,
  InvalidResetToken: InvalidResetTokenError,
  ExpiredResetToken: ExpiredResetTokenError,
  EmailNotRegistered: EmailNotRegisteredError,
  Coupon: {
    NotFound: CouponNotFoundError,
    AlreadyExists: CouponAlreadyExistsError,
    AlreadyUsed: CouponAlreadyUsedError,
    isNotFirst: CouponIsNotFirstError,
    lessThanMin: CouponIsLessThanMinError,
  },
  Products: {
    NotFound: ProductNotFoundError,
    InsufficientValue: InsufficientValueError,
  },
  Category: {
    NotFound: CategoryNotFoundError,
  },
};
