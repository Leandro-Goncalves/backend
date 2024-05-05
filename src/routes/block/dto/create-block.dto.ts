import { PickType } from '@nestjs/mapped-types';
import { Block } from '../entities/block.entity';

export class CreateBlockDto extends PickType(Block, [
  'name',
  'description',
  'link',
  'buttonText',
] as const) {}
