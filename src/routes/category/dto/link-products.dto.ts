import { IsArray, IsUUID } from 'class-validator';

export class LinkProductsDto {
  @IsArray()
  @IsUUID(undefined, { each: true })
  uuids: string[];
}
