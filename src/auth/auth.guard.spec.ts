import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { Errors } from '../errors';
import { faker } from '@faker-js/faker';
import { Roles } from '../users/entities/user.entity';
import { Env } from '@/config/env';

const generateContext = (token: string) =>
  createMock<ExecutionContext>({
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        headers: {
          authorization: token,
        },
      }),
    }),
  });

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: Env.JWTSecret,
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [AuthGuard],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should throw InvalidToken when do not have authorization header', async () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: new Map(),
        }),
      }),
    });

    expect(authGuard.canActivate(context)).rejects.toThrow(
      Errors.UnauthorizedUser,
    );
  });

  it('should throw InvalidToken - invalid bearer', async () => {
    const context = generateContext('invalid');

    expect(authGuard.canActivate(context)).rejects.toThrow(
      Errors.UnauthorizedUser,
    );
  });

  it('should throw InvalidToken - invalid token', async () => {
    const context = generateContext('Bearer invalid');

    expect(authGuard.canActivate(context)).rejects.toThrow(
      Errors.UnauthorizedUser,
    );
  });

  it('should return true', async () => {
    const user = {
      id: faker.string.uuid(),
      role: [Roles.USER],
    };
    const token = jwtService.sign(user);
    const context = generateContext(`Bearer ${token}`);

    expect(authGuard.canActivate(context)).resolves.toBe(true);
    expect(context.switchToHttp().getRequest()).toEqual(
      expect.objectContaining({
        user: { exp: expect.any(Number), iat: expect.any(Number), ...user },
      }),
    );
  });
});
