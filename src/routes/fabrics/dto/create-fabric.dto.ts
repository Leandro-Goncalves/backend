import { PickType } from '@nestjs/mapped-types';
import { Fabric } from '../entities/fabric.entity';

export class CreateFabricDto extends PickType(Fabric, [
  'name',
  'description',
]) {}
