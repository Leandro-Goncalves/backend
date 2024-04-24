import { PartialType } from '@nestjs/mapped-types';
import { CreateDoubtDto } from './create-doubt.dto';

export class UpdateDoubtDto extends PartialType(CreateDoubtDto) {}
