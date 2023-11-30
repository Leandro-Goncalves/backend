import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RegisterUserDTO } from './dto/RegisterUserDTO';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaClient, ResetToken } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { Errors } from '../../errors';
import { faker } from '@faker-js/faker';
import { BcryptService } from '../../bcrypt/bcrypt.service';
import { LoginUserDTO } from './dto/LoginUserDTO';
import { Roles, User } from './entities/User.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { createMock } from '@golevelup/ts-jest';
import { AuthReq } from '../../types/authReq';
import { getQueueToken } from '@nestjs/bull';
import { Queue } from 'bull';
import { DateService } from '@/date/date.service';
import { Env } from '@/config/env';

interface mockedResetTokenProps {
  token?: string;
  expiresAt?: Date;
  userId?: string;
}
const mockedResetToken = (props?: mockedResetTokenProps): ResetToken => ({
  expiresAt: props?.expiresAt ?? new Date(),
  uuid: faker.string.uuid(),
  token: props?.token ?? faker.string.uuid(),
  userId: props?.userId ?? faker.string.uuid(),
  createdAt: new Date(),
});

const mockUser = (): User => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  password: faker.internet.password(),
  refreshToken: faker.string.uuid(),
});

describe('UsersController', () => {
  let usersController: UsersController;
  let prisma: DeepMockProxy<any>;
  let bcryptService: BcryptService;
  let jwtService: JwtService;
  let dateService: DateService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: Env.JWTSecret,
          signOptions: { expiresIn: '60s' },
        }),
      ],
      controllers: [UsersController],
      providers: [
        UsersService,
        PrismaService,
        BcryptService,
        { provide: getQueueToken('email-job'), useValue: createMock<Queue>() },
        DateService,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    usersController = app.get<UsersController>(UsersController);
    prisma = app.get(PrismaService);
    bcryptService = app.get(BcryptService);
    jwtService = app.get(JwtService);
    dateService = app.get(DateService);
  });

  describe('register', () => {
    it('should not register a user with email is already registered', async () => {
      const user = mockUser();

      prisma.user.findUnique.mockResolvedValue(user);

      expect(usersController.register(user)).rejects.toThrowError(
        Errors.UserAlreadyExists,
      );
    });

    it('should encrypt password', async () => {
      const user = mockUser();

      await usersController.register(user);

      expect(prisma.user.create).toBeCalledWith({
        data: expect.objectContaining({
          id: user.id,
          email: user.email,
          name: user.name,
          password: expect.not.stringMatching(user.password),
        }),
      });
    });

    it('should register a user', async () => {
      const user: RegisterUserDTO = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
      };
      expect(usersController.register(user)).resolves.toBe(undefined);
    });
  });

  describe('login', () => {
    it('should not login when email is not registered', () => {
      const validUser = mockUser();

      const user: LoginUserDTO = {
        email: validUser.email,
        password: validUser.password,
      };

      prisma.user.findUnique.mockResolvedValue(undefined);

      expect(usersController.login(user)).rejects.toThrowError(
        Errors.UserOrEmailNotRegistered,
      );
    });

    it('should not login when password is not registered', () => {
      const validUser = mockUser();

      const user: LoginUserDTO = {
        email: validUser.email,
        password: faker.internet.password(),
      };

      prisma.user.findUnique.mockResolvedValue(validUser);

      expect(usersController.login(user)).rejects.toThrowError(
        Errors.UserOrEmailNotRegistered,
      );
    });

    it('should login a user', async () => {
      const validUser = mockUser();
      const user: LoginUserDTO = {
        email: validUser.email,
        password: validUser.password,
      };

      const passwordHashed = await bcryptService.hash(user.password);
      prisma.user.findUnique.mockResolvedValue({
        ...validUser,
        password: passwordHashed,
      });

      expect(usersController.login(user)).resolves.toEqual({
        id: validUser.id,
        name: validUser.name,
        email: user.email,
        token: expect.any(String),
        refreshToken: expect.any(String),
      });
    });

    it('should generate a token', async () => {
      const validUser = mockUser();
      const user: LoginUserDTO = {
        email: validUser.email,
        password: validUser.password,
      };

      const passwordHashed = await bcryptService.hash(user.password);
      prisma.user.findUnique.mockResolvedValue({
        ...validUser,
        password: passwordHashed,
      });

      const { token } = await usersController.login(user);

      expect(token).toMatch(/^[\w-]*\.[\w-]*\.[\w-]*$/);

      const tokenDecrypt = jwtService.verify(token);
      expect(tokenDecrypt).toEqual(
        expect.objectContaining({
          id: validUser.id,
          role: [Roles.USER],
        }),
      );
    });

    it('should generate a admin token', async () => {
      const validUser = mockUser() as any;
      validUser.isAdmin = true;
      const user: LoginUserDTO = {
        email: validUser.email,
        password: validUser.password,
      };

      const passwordHashed = await bcryptService.hash(user.password);
      prisma.user.findUnique.mockResolvedValue({
        ...validUser,
        password: passwordHashed,
      });

      const { token } = await usersController.login(user);

      const tokenDecrypt = jwtService.verify(token);
      expect(tokenDecrypt).toEqual(
        expect.objectContaining({
          id: validUser.id,
          role: [Roles.ADMIN],
        }),
      );
    });
  });

  describe('refresh token', () => {
    it('should return error when user id is not valid', async () => {
      const validUser = mockUser();
      prisma.user.findUnique.mockResolvedValue(undefined);

      const req = createMock<AuthReq>({
        user: {
          id: validUser.id,
          role: [Roles.USER],
        },
      });

      expect(
        usersController.refreshToken(req, validUser.refreshToken),
      ).rejects.toThrowError(Errors.InvalidRefreshToken);
    });

    it('should return error when user refresh token is not valid', async () => {
      const validUser = mockUser();
      prisma.user.findUnique.mockResolvedValue(validUser);

      const req = createMock<AuthReq>({
        user: {
          id: validUser.id,
          role: [Roles.USER],
        },
      });

      expect(
        usersController.refreshToken(req, 'wrong refresh token'),
      ).rejects.toThrowError(Errors.InvalidRefreshToken);
    });

    it('should refresh a token', async () => {
      const validUser = mockUser();
      prisma.user.findUnique.mockResolvedValue(validUser);

      const req = createMock<AuthReq>({
        user: {
          id: validUser.id,
          role: [Roles.USER],
        },
      });

      expect(
        usersController.refreshToken(req, validUser.refreshToken),
      ).resolves.toEqual({
        refreshToken: expect.any(String),
        token: expect.any(String),
      });
    });
  });

  describe('reset password', () => {
    it('should not generate a reset link when user is invalid', async () => {
      const validUser = mockUser();

      await usersController.resetPassword({ email: validUser.email });
      expect(prisma.resetToken.upsert).not.toBeCalled();
    });

    it('should generate a reset link', async () => {
      const validUser = mockUser();
      prisma.user.findUnique.mockResolvedValue(validUser);

      await usersController.resetPassword({ email: validUser.email });
      expect(prisma.resetToken.upsert).toBeCalled();
    });

    it('should not reset password when token is not valid', async () => {
      const validUser = mockUser();

      expect(
        usersController.resetPasswordCode(
          { password: validUser.password },
          faker.string.uuid(),
        ),
      ).rejects.toThrowError(Errors.InvalidResetToken);
    });

    it('should not reset password when token is expired', async () => {
      const validUser = mockUser();
      const code = faker.string.uuid();

      const expiresAt = dateService.yesterday().date;

      const token = mockedResetToken({ token: code, expiresAt });

      prisma.resetToken.findFirst.mockResolvedValue(token);

      expect(
        usersController.resetPasswordCode(
          { password: validUser.password },
          code,
        ),
      ).rejects.toThrowError(Errors.ExpiredResetToken);
    });

    it('should reset password', async () => {
      const validUser = mockUser();
      const code = faker.string.uuid();

      const expiresAt = dateService.tomorrow().date;

      const token = mockedResetToken({
        token: code,
        expiresAt,
        userId: validUser.id,
      });

      prisma.resetToken.findFirst.mockResolvedValueOnce(token);

      await usersController.resetPasswordCode(
        { password: validUser.password },
        code,
      );

      expect(prisma.user.update).toBeCalledWith(
        expect.objectContaining({
          where: {
            id: validUser.id,
          },
          data: {
            password: expect.any(String),
          },
        }),
      );

      expect(
        usersController.resetPasswordCode(
          { password: validUser.password },
          code,
        ),
      ).rejects.toThrowError(Errors.InvalidResetToken);
    });
  });
});
