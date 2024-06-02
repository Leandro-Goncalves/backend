import { Establishment as EstablishmentType } from '@prisma/client';
import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class Establishment implements EstablishmentType {
  @IsUUID()
  uuid: string;

  @IsString()
  @IsOptional()
  alert: string;

  @IsString()
  description: string;

  @IsString()
  phone: string;

  @IsInt()
  installments: number;

  @IsString()
  createdAt: Date;

  @IsString()
  updatedAt: Date;

  @IsUUID()
  themeGuid: string;

  @IsString()
  icon: string;

  @IsUUID()
  blockGuid: string;

  @IsString()
  storyText: string;

  @IsString()
  storyImage: string;
}
