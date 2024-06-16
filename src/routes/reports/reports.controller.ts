import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { PaginationQueryDto } from '@/utils/pagination';
import { UseAuth } from '@/auth/roles.decorator';
import { Roles } from '../users/entities/user.entity';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseAuth([Roles.ADMIN])
  @Get('/sales')
  findSales(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.reportsService.findSales(paginationQueryDto);
  }

  @UseAuth([Roles.ADMIN])
  @Get('/users')
  findUsers(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.reportsService.findUsers(paginationQueryDto);
  }
}
