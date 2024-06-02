import { PartialType, PickType } from '@nestjs/mapped-types';
import { Establishment } from '../entities/establishment.entity';

export class UpdateStoryDto extends PickType(PartialType(Establishment), [
  'storyText',
]) {}
