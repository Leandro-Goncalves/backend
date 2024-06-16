import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class PaginationQueryDto {
  @IsInt()
  @Transform(({ value }) => Number(value))
  page: number;

  @IsInt()
  @Transform(({ value }) => Number(value))
  size: number;

  @IsString()
  @IsOptional()
  startDate?: Date;

  @IsString()
  @IsOptional()
  endDate?: Date;
}

export class PaginationResponseDto<T> {
  hasMore: boolean;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  results: T[];

  constructor(partial: Partial<PaginationResponseDto<T>>) {
    Object.assign(this, partial);
  }
}
