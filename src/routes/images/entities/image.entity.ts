import { IsString, IsUUID } from 'class-validator';

export class Image {
  @IsUUID()
  uuid: string;

  @IsString()
  imageId: string;

  @IsString()
  createdAt: Date;

  @IsString()
  updatedAt: Date;
}
