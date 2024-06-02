import { Feedback as IFeedback } from '@prisma/client';
import { IsBoolean, IsInt, IsString, IsUUID } from 'class-validator';

export class Feedback implements Partial<IFeedback> {
  @IsUUID()
  uuid: string;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  name: string;

  @IsInt()
  position: number;
}
