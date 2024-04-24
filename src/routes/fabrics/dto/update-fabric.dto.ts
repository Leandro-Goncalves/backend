import { PartialType } from '@nestjs/mapped-types';
import { CreateFabricDto } from './create-fabric.dto';

export class UpdateFabricDto extends PartialType(CreateFabricDto) {}
