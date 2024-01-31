import {
  Controller,
  Post,
  Body,
  Request,
  Param,
  HttpCode,
  Put,
  Get,
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
import { updateUserDTO } from './dto/updateUserDTO';

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

  @Get('/refreshToken/:id/:refresh')
  @HttpCode(200)
  refreshToken(
    @Param('id') userId: string,
    @Param('refresh') refreshToken: string,
  ): Promise<RefreshTokenDTO> {
    return this.usersService.refreshToken(userId, refreshToken);
  }

  @Post('/resetPassword')
  @HttpCode(200)
  resetPassword(@Body() body: generateResetCodeDTO) {
    const { email } = body;
    return this.usersService.generateResetPasswordCode(email);
  }

  @UseAuth([Roles.USER])
  @Put('')
  updateUser(@Request() req: AuthReq, @Body() body: updateUserDTO) {
    const { id } = req.user;
    const { name, password } = body;
    return this.usersService.updateData(id, name, password);
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
