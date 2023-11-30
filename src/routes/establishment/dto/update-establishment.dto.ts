import { PartialType, PickType } from '@nestjs/mapped-types';
import { Establishment } from '../entities/establishment.entity';

export class UpdateEstablishmentDto extends PickType(
  PartialType(Establishment),
  ['phone', 'description', 'alert'],
) {}
