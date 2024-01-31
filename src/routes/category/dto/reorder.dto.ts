import { IsArray, IsUUID } from 'class-validator';

export class ReorderDto {
  @IsArray()
  @IsUUID(undefined, { each: true })
  guids: string[];
}
