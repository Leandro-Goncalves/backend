import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { PaginationQueryDto, PaginationResponseDto } from '@/utils/pagination';

@Injectable()
export class ReportsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findSales(paginationQueryDto: PaginationQueryDto) {
    const ordersDelivery = await this.prismaService.order
      .findMany({
        where: {
          status: 'finished',
          updatedAt: {
            gte: paginationQueryDto.startDate,
            lte: paginationQueryDto.endDate,
          },
        },
        select: {
          guid: true,
          total: true,
          freightValue: true,
          products: true,
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

    const ordersTakeout = await this.prismaService.orderTakeout
      .findMany({
        where: {
          status: 'finished',
          updatedAt: {
            gte: paginationQueryDto.startDate,
            lte: paginationQueryDto.endDate,
          },
        },
        select: {
          guid: true,
          total: true,
          products: true,
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

    const ordersTakeoutTotal = await this.prismaService.orderTakeout.count({
      where: {
        status: 'finished',
        updatedAt: {
          gte: paginationQueryDto.startDate,
          lte: paginationQueryDto.endDate,
        },
      },
    });

    const ordersDeliveryTotal = await this.prismaService.order.count({
      where: {
        status: 'finished',
        updatedAt: {
          gte: paginationQueryDto.startDate,
          lte: paginationQueryDto.endDate,
        },
      },
    });

    const ordersTotal = ordersDeliveryTotal + ordersTakeoutTotal;

    ordersDelivery.map((order) => {
      order.products = JSON.parse(order.products as string);
    });

    ordersTakeout.map((orderTakeout) => {
      orderTakeout.products = JSON.parse(orderTakeout.products as string);
    });

    const orders = [...ordersDelivery, ...ordersTakeout]
      .sort((a, b) => (a.updatedAt.getTime() < b.updatedAt.getDate() ? 1 : -1))
      .slice(
        paginationQueryDto.size * paginationQueryDto.page,
        paginationQueryDto.size * paginationQueryDto.page +
          paginationQueryDto.size,
      );

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

  async findUsers(paginationQueryDto: PaginationQueryDto) {
    const users = await this.prismaService.user.findMany({
      skip: paginationQueryDto.size * paginationQueryDto.page,
      take: paginationQueryDto.size,
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        isAdmin: false,
      },
      select: {
        uuid: true,
        name: true,
        email: true,
        phone: true,
        cpf: true,
        orders: true,
        OrderTakeout: true,
      },
    });

    const usersTotal = await this.prismaService.user.count({});

    return new PaginationResponseDto({
      currentPage: paginationQueryDto.page,
      pageSize: paginationQueryDto.size,
      results: users,
      totalItems: usersTotal,
      totalPages: Math.ceil(usersTotal / paginationQueryDto.size),
      hasMore:
        paginationQueryDto.page <
        Math.ceil(usersTotal / paginationQueryDto.size),
    });
  }
}
