import { PartialType, PickType } from '@nestjs/mapped-types';
import { Establishment } from '../entities/establishment.entity';
import { IsOptional, IsString } from 'class-validator';

export class UpdateEstablishmentDto extends PickType(
  PartialType(Establishment),
  ['phone', 'description', 'alert', 'themeGuid', 'blockGuid'],
) {
  @IsString()
  @IsOptional()
  installments: number;
}
