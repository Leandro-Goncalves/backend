import {
  Controller,
  Post,
  Body,
  Request,
  Param,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDTO } from './dto/RegisterUserDTO';
import { LoginUserDTO } from './dto/LoginUserDTO';
import { Roles, UserWithToken } from './entities/user.entity';
import { RefreshTokenDTO } from './dto/RefreshTokenDTO';
import { AuthReq } from '../../types/authReq';
import { ResetPasswordDTO } from './dto/ResetPasswordDTO';
import { generateResetCodeDTO } from './dto/generateResetCodeDTO';
import { UseAuth } from '@/auth/roles.decorator';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  register(@Body() user: RegisterUserDTO): Promise<void> {
    return this.usersService.register(user);
  }

  @Post('/login')
  @HttpCode(200)
  login(@Body() user: LoginUserDTO): Promise<UserWithToken> {
    return this.usersService.login(user);
  }

  @UseAuth([Roles.USER])
  @Post('/refreshToken/:refresh')
  @HttpCode(200)
  refreshToken(
    @Request() req: AuthReq,
    @Param('refresh') refreshToken: string,
  ): Promise<RefreshTokenDTO> {
    const { id } = req.user;
    return this.usersService.refreshToken(id, refreshToken);
  }

  @Post('/resetPassword')
  @HttpCode(200)
  resetPassword(@Body() body: generateResetCodeDTO) {
    const { email } = body;
    return this.usersService.generateResetPasswordCode(email);
  }

  @Post('/resetPassword/:code')
  @HttpCode(200)
  resetPasswordCode(
    @Body() body: ResetPasswordDTO,
    @Param('code') code: string,
  ) {
    const { password } = body;
    return this.usersService.resetPasswordCode(password, code);
  }
}
