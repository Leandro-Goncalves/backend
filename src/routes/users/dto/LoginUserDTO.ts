import { IsNotEmpty, IsEmail } from 'class-validator';

export class LoginUserDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
