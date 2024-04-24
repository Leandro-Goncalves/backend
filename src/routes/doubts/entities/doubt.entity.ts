import { Doubts as IDoubts } from '@prisma/client';
import { IsInt, IsString, IsUUID } from 'class-validator';

export class Doubt implements Partial<IDoubts> {
  @IsUUID()
  guid: string;

  @IsString()
  answer: string;

  @IsString()
  question: string;

  @IsInt()
  position: number;
}
