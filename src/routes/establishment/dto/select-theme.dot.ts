import { PickType } from '@nestjs/mapped-types';
import { Establishment } from '../entities/establishment.entity';

export class SelectThemeDto extends PickType(Establishment, [
  'themeGuid',
] as const) {}
