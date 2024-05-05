import { Block as IBlock } from '@prisma/client';
import { IsBoolean, IsInt, IsString, IsUUID } from 'class-validator';

export class Block implements Partial<IBlock> {
  @IsUUID()
  guid: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  link: string;

  @IsInt()
  position: number;

  @IsString()
  url: string;

  @IsString()
  buttonText: string;
}
