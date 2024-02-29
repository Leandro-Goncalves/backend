import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class RegisterUserDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  password: string;

  @IsString()
  cpf: string;

  @IsNotEmpty()
  phone: string;
}
