import { PickType } from '@nestjs/mapped-types';
import { Doubt } from '../entities/doubt.entity';

export class CreateDoubtDto extends PickType(Doubt, [
  'question',
  'answer',
] as const) {}
