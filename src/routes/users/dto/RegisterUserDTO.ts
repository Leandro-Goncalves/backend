import { IsNotEmpty, IsEmail } from 'class-validator';

export class RegisterUserDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  phone: string;
}
