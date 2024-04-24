import { Fabric as IFabric } from '@prisma/client';
import { IsBoolean, IsString, IsUUID, IsInt } from 'class-validator';

export class Fabric implements Partial<IFabric> {
  @IsUUID()
  guid: string;

  @IsString()
  description: string;

  @IsString()
  name: string;

  @IsBoolean()
  isActive: boolean;

  @IsInt()
  position: number;
}
