import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class updateUserDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  password?: string;
}
