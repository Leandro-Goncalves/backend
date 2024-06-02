import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { PaginationQueryDto, PaginationResponseDto } from '@/utils/pagination';

@Injectable()
export class ReportsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findSales(paginationQueryDto: PaginationQueryDto) {
    const orders = await this.prismaService.order
      .findMany({
        take: paginationQueryDto.size,
        skip: paginationQueryDto.page * paginationQueryDto.size,
        where: {
          status: 'finished',
        },
        select: {
          guid: true,
          total: true,
          freightValue: true,
          state: true,
          city: true,
          neighborhood: true,
          street: true,
          number: true,
          complement: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          updatedAt: true,
        },
      })
      .then((orders) => {
        return orders.map((order) => ({
          ...order,
          user: undefined,
          userName: order.user.name,
          email: order.user.email,
        }));
      });

    const ordersTotal = await this.prismaService.order.count({
      where: {
        status: 'finished',
      },
    });

    console.log(orders);

    return new PaginationResponseDto({
      currentPage: paginationQueryDto.page,
      pageSize: paginationQueryDto.size,
      results: orders,
      totalItems: ordersTotal,
      totalPages: Math.ceil(ordersTotal / paginationQueryDto.size),
      hasMore:
        paginationQueryDto.page <
        Math.ceil(ordersTotal / paginationQueryDto.size),
    });
  }

  create(createReportDto: CreateReportDto) {
    return 'This action adds a new report';
  }

  findAll() {
    return `This action returns all reports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  update(id: number, updateReportDto: UpdateReportDto) {
    return `This action updates a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
