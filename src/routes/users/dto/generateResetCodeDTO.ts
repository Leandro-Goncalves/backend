import { IsEmail } from 'class-validator';

export class generateResetCodeDTO {
  @IsEmail()
  email: string;
}
