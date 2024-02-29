import { Injectable } from '@nestjs/common';
import { RegisterUserDTO } from './dto/RegisterUserDTO';
import { PrismaService } from '../../prisma/prisma.service';
import { Errors } from '../../errors';
import { BcryptService } from '../../bcrypt/bcrypt.service';
import { LoginUserDTO } from './dto/LoginUserDTO';
import { Roles, UserWithToken } from './entities/user.entity';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDTO } from './dto/RefreshTokenDTO';
import { DateService } from '@/date/date.service';
import { Env } from '@/config/env';
import { BrevoService } from '@/services/brevo/brevo.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private bcryptService: BcryptService,
    private jwtService: JwtService,
    private brevoService: BrevoService,
    private dateService: DateService,
  ) {}
  async register(nUser: RegisterUserDTO): Promise<void> {
    const newUser = { ...nUser };
    const user = await this.prisma.user.findUnique({
      where: {
        email: newUser.email,
      },
    });

    if (user) {
      throw Errors.UserAlreadyExists;
    }

    const userCpf = await this.prisma.user.findUnique({
      where: {
        cpf: nUser.cpf,
      },
    });

    if (userCpf) {
      throw Errors.User.CPFAlreadyRegistered;
    }

    newUser.password = await this.bcryptService.hash(newUser.password);

    await this.prisma.user.create({
      data: { ...newUser, refreshToken: randomUUID() },
    });

    await this.brevoService.createContact({
      email: newUser.email,
      name: newUser.name,
    });
  }

  async login(user: LoginUserDTO): Promise<UserWithToken> {
    const dbUser = await this.prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (!dbUser) {
      throw Errors.UserOrEmailNotRegistered;
    }

    const isPasswordValid = await this.bcryptService.compare(
      user.password,
      dbUser.password,
    );

    if (!isPasswordValid) {
      throw Errors.UserOrEmailNotRegistered;
    }

    const token = this.generateJWTToken(dbUser.uuid, dbUser.isAdmin);

    delete dbUser.password;
    delete dbUser.isAdmin;
    return {
      id: dbUser.uuid,
      email: dbUser.email,
      name: dbUser.name,
      refreshToken: dbUser.refreshToken,
      token,
    };
  }

  private generateJWTToken(userId: string, isAdmin: boolean): string {
    return this.jwtService.sign(
      {
        id: userId,
        role: [Roles.USER, isAdmin ? Roles.ADMIN : []].flat(),
        establishmentUuid: Env.EstablishmentUUID,
      },
      {
        expiresIn: '10y',
      },
    );
  }

  async refreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<RefreshTokenDTO> {
    const user = await this.prisma.user.findUnique({
      where: {
        uuid: userId,
      },
    });

    if (!user) {
      throw Errors.InvalidRefreshToken;
    }

    if (user.refreshToken !== refreshToken) {
      throw Errors.InvalidRefreshToken;
    }

    const newRefreshToken = randomUUID();
    const token = this.generateJWTToken(user.uuid, user.isAdmin);

    await this.prisma.user.update({
      where: {
        uuid: userId,
      },
      data: {
        refreshToken: newRefreshToken,
      },
    });

    return {
      refreshToken: newRefreshToken,
      token,
    };
  }

  async generateResetPasswordCode(email: string): Promise<void> {
    const resetPassword = randomUUID();

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return;
    }

    await this.prisma.resetToken.upsert({
      where: {
        userId: user.uuid,
      },
      create: {
        userId: user.uuid,
        token: resetPassword,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
      update: {
        token: resetPassword,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
      include: {
        user: true,
      },
    });

    this.brevoService.sendForgotPassword({
      name: user.name,
      resetPassword,
      email: user.email,
    });
  }

  async updateData(userId: string, newName: string, newPassword?: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        uuid: userId,
      },
    });

    if (!user) {
      throw Errors.UnauthorizedUser;
    }

    if (newPassword) {
      user.password = await this.bcryptService.hash(newPassword);
    }

    user.name = newName;

    await this.prisma.user.update({
      where: {
        uuid: userId,
      },
      data: {
        name: user.name,
        password: user.password,
      },
    });

    const token = this.generateJWTToken(user.uuid, user.isAdmin);

    return {
      id: user.uuid,
      email: user.email,
      name: user.name,
      refreshToken: user.refreshToken,
      token,
    };
  }

  async resetPasswordCode(newPassword: string, code: string): Promise<void> {
    const resetCode = await this.prisma.resetToken.findFirst({
      where: {
        token: code,
      },
    });

    if (!resetCode) {
      throw Errors.InvalidResetToken;
    }

    if (this.dateService.date(resetCode.expiresAt).isBefore(new Date())) {
      throw Errors.ExpiredResetToken;
    }

    const hashPassword = await this.bcryptService.hash(newPassword);

    await this.prisma.user.update({
      where: {
        uuid: resetCode.userId,
      },
      data: {
        password: hashPassword,
      },
    });
    await this.prisma.resetToken.delete({
      where: {
        uuid: resetCode.uuid,
      },
    });
  }
}
