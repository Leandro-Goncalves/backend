import { IsString, IsUUID } from 'class-validator';

export class Category {
  @IsUUID()
  uuid: string;

  @IsString()
  name: string;

  @IsString()
  createdAt: Date;

  @IsString()
  updatedAt: Date;
}
